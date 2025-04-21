import { useSearchParams } from "react-router";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function UpdatePassword() {
    const [searchParams] = useSearchParams();
    const [tokenAvailable, setTokenAvailable] = useState(false);
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            Cookies.set('upPassSec', token, { expires: 15 / (24 * 60) });
            setTokenAvailable(true);
        }
    }, [token]);

    return (
        <>
            {
                tokenAvailable ? (<div>
                    <h2 className="text-2xl font-bold my-5 text-center">Please Update Your Password Here.</h2>
                    <p className="font-semibold text-center">Your token to update your password is valid for 15 minutes from now. Token: {token}</p>

                    {/* Update password form */}
                    <UpdatePasswordForm />
                </div>) : (<div>
                    <h2 className="font-bold text-2xl my-5">Token is missing.</h2>
                    <p className="text-yellow-500 text-xl font-semibold">Token is required to update user password. Unauthorized Access.</p>
                </div>)
            }
        </>
    );
}

export default UpdatePassword;
