import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import { decodeJwt } from "jose";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function ProtectedRoute() {
    const auth = useAuth();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const token = Cookies.get('uscTDLT');

    let decoded;
    let expired = false;
    const currentTime = Math.floor(Date.now() / 1000);

    useEffect(() => {
        const handleLogout = async () => {
            if (auth && expired) {
                Cookies.remove('uscTDLT');
                await auth.logout();
                setShouldRedirect(true);
            }
        };
        handleLogout();
    }, [expired, auth]);

    if (token) {
        decoded = decodeJwt(token);
    }

    if (decoded?.exp && decoded.exp < currentTime) {
        expired = true;
    }

    if (shouldRedirect) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (!token || !auth || !auth.isUserAvailable) {
        return <Navigate to={"/login"} state={{ from: location }} />
    }

    if (auth && auth.userLoading) return <div className='absolute top-0 right-0 left-0 bottom-0 bg-black opacity-35 z-50 flex justify-center items-center text-4xl text-yellow-500'>Loading....</div>

    if (token && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
        return <Navigate to={"/"} />
    }

    return <Outlet />;
}

export default ProtectedRoute;