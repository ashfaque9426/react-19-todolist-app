import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import { decodeJwt } from "jose";
import Cookies from 'js-cookie';

function ProtectedRoute() {
    const auth = useAuth();
    const location = useLocation();

    const token = Cookies.get('uscTDLT');

    let decoded;
    let expired = false;
    const currentTime = Math.floor(Date.now() / 1000);

    if(token) {
        decoded = decodeJwt(token); 
    }

    if (decoded?.exp && decoded.exp < currentTime) {
        expired = true;
    }

    if (!auth) throw new Error("Auth context is not defined properly.");
    else if (auth && auth.userLoading) return <div className='absolute top-0 right-0 left-0 bottom-0 bg-black opacity-35 z-50 flex justify-center items-center text-4xl text-yellow-500'>Loading....</div>
    else if (auth && auth.isUserAvailable && expired) {
        Cookies.remove('uscTDLT');
        // logout action here
        return <Navigate to={"/login"} state={{from: location}} />
    }
    else if(auth && auth.isUserAvailable && !expired) {
        return <Outlet />;
    }

    return <Navigate to={"/login"} state={{from: location}} />
  
}

export default ProtectedRoute;