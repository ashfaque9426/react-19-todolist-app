import { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import { decodeJwt } from "jose";
import Cookies from 'js-cookie';

function ProtectedRoute({ children }: { children: ReactNode }) {
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
        // logout action here
    }
    else if(auth && auth.isUserAvailable && !expired) {
        return children;
    }

    return <Navigate to={"/login"} state={{from: location}} />
  
}

export default ProtectedRoute;