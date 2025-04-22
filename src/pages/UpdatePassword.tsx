import { useSearchParams } from "react-router";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function UpdatePassword() {
    const [tokenAvailable, setTokenAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        setLoading(true);

        const tokenAvailable = Cookies.get('upPassSec');
        if ((token && !tokenAvailable) || (token && tokenAvailable !== token)) {
            Cookies.set('upPassSec', token, { expires: 15 / (24 * 60) });
            setTokenAvailable(true);
        } else if (tokenAvailable && (tokenAvailable === token)) {
            setTokenAvailable(true);
        } else {
            setTokenAvailable(false);
        }

        setLoading(false);
    }, [token]);

    return (
        <>
            {
                tokenAvailable ? (<div className="w-full h-full px-1 md:px-0">
                    <h2 className="text-2xl font-bold my-5 text-center">Please Update Your Password Here.</h2>
                    <p className="font-semibold text-xl text-center">Your token to update your password is valid for 15 minutes from now. Token: {token}</p>

                    {/* Update password form */}
                    <UpdatePasswordForm />
                </div>) : (<div className="w-full h-full flex flex-col justify-center items-center gap-5">
                    {
                        loading ? <div className='absolute top-0 right-0 left-0 bottom-0 bg-black opacity-35 z-50 flex justify-center items-center text-4xl text-yellow-500'>Loading....</div> : <>
                            <h2 className="font-bold text-2xl">Token is missing.</h2>
                            <p className="text-yellow-500 text-xl font-semibold">Token is required to update user password. Unauthorized Access.</p>
                        </>
                    }
                    
                </div>)
            }
        </>
    );
}

export default UpdatePassword;
