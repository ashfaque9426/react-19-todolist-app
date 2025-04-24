import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import LoadingData from '../components/LoadingData';

function ProtectedRoute() {
    // bring the auth context from useAuth hook
    const auth = useAuth();
    // get the location object from react-router
    const location = useLocation();

    // Check if the token is not available and if so redirect to login page
    // and if the user is trying to access the login, register or update password page
    if (!auth || !auth.user) {
        if (location.pathname.startsWith("/login") || location.pathname.startsWith("/register") || location.pathname.startsWith("/update-password")) {
            return <Outlet />;
        }
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Check if the auth is still loading and if so retrun the loading jsx element
    if (auth.userLoading) return <LoadingData />;

    // Check if the token is available and and if the user is trying to access the login, register or update password page and if so redirect to home page
    if (auth.user && (location.pathname.startsWith("/login") || location.pathname.startsWith("/register") || location.pathname.startsWith("/update-password"))) {
        return <Navigate to={"/"} />
    }

    // If the user is logged in and the token is available, return the outlet component
    // which will render the child components of the protected route
    return <Outlet />;
}

export default ProtectedRoute;