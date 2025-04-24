import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import LoadingData from '../components/LoadingData';

function ProtectedRoute() {
    // bring the auth context from useAuth hook
    const auth = useAuth();
    // get the location object from react-router
    const location = useLocation();

    // Check if the auth.user object is undefined,that means user login credentials are missing and if so redirect to login page only if user is not trying to access the login, register or update password page
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

    // if the bellow code is about to execute that means the user is logged in and the token is available so return the Outlet component which will render the child components of the route
    return <Outlet />;
}

export default ProtectedRoute;