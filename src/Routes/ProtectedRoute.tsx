import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import { decodeJwt } from "jose";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
    // bring the auth context from useAuth hook
    const auth = useAuth();
    // get the location object from react-router
    const location = useLocation();

    // state to handle redirection to login page
    // and to check if the token is expired
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [expired, setExpired] = useState(false);

    // Logout user if token is expired
    // and redirect to login page
    useEffect(() => {
        const handleLogout = async () => {
            if (auth && auth.user && expired) {
                await auth.logout(auth.user.userEmail);
                setShouldRedirect(true);
            }
        };
        handleLogout();
    }, [expired, auth]);

    // Check if the token is expired
    // and set the expired state accordingly
    const token = Cookies.get('uscTDLT');

    // Get the current time in seconds
    // to compare with the token expiration time
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the token is expired
    // and set the expired state accordingly
    useEffect(() => {
        if (token) {
            const decoded = decodeJwt(token);
            if (decoded?.exp && decoded.exp < currentTime) {
                setExpired(true);
            }
        }
    }, [token, currentTime]);

    // Check if the auth is still loading and if so retrun the loading jsx element
    if (auth && auth.userLoading) return <div className='absolute top-0 right-0 left-0 bottom-0 bg-black opacity-35 z-50 flex justify-center items-center text-4xl text-yellow-500'>Loading....</div>

    // Check if the user is logged out and if so redirect to login page
    if (shouldRedirect) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Check if the token is not available and if so redirect to login page
    // and if the user is trying to access the login, register or update password page
    if (!token) {
        if (location.pathname.startsWith("/login") || location.pathname.startsWith("/register") || location.pathname.startsWith("/update-password")) {
            return <Outlet />;
        }
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Check if the token is available and and if the user is trying to access the login, register or update password page and if so redirect to home page
    if (token && (location.pathname.startsWith("/login") || location.pathname.startsWith("/register") || location.pathname.startsWith("/update-password"))) {
        return <Navigate to={"/"} />
    }

    // If the user is logged in and the token is available, return the outlet component
    // which will render the child components of the protected route
    return <Outlet />;
}

export default ProtectedRoute;