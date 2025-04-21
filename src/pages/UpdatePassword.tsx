import { useSearchParams } from "react-router";
import UpdatePasswordForm from "../components/UpdatePasswordForm";

function UpdatePassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return (
        <>
            {
                token ? (<div>
                    <h2 className="text-2xl font-bold my-5 text-center">Please Update Your Password Here.</h2>
                    <p className="font-semibold text-center">Your token to update your password is valid for 15 minutes from now. Token: {token}</p>

                    {/* Update password form */}
                    <UpdatePasswordForm token={token} />
                </div>) : (<div>
                    <h2 className="font-bold text-2xl my-5">Token is missing.</h2>
                    <p className="text-yellow-500 text-xl font-semibold">Token is required to update user password. Unauthorized Access.</p>
                </div>)
            }
        </>
    );
}

export default UpdatePassword;
