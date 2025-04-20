import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import { decodeJwt } from "jose";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
    const auth = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const handleLogout = async () => {
            if (auth && auth.user && expired) {
                await auth.logout(auth.user.userEmail);
                setShouldRedirect(true);
            }
        };
        handleLogout();
    }, [expired, auth]);

    const token = Cookies.get('uscTDLT');
    const currentTime = Math.floor(Date.now() / 1000);

    useEffect(() => {
        if (token) {
            const decoded = decodeJwt(token);
            if (decoded?.exp && decoded.exp < currentTime) {
                setExpired(true);
            }
        }
    }, [token, currentTime]);

    if (auth && auth.userLoading) return <div className='absolute top-0 right-0 left-0 bottom-0 bg-black opacity-35 z-50 flex justify-center items-center text-4xl text-yellow-500'>Loading....</div>

    if (shouldRedirect) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (!token) {
        if (location.pathname.startsWith("/login") || location.pathname.startsWith("/register")) {
            return <Outlet />;
        }
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (token && (location.pathname.startsWith("/login") || location.pathname.startsWith("/register"))) {
        return <Navigate to={"/"} />
    }

    return <Outlet />;
}

export default ProtectedRoute;