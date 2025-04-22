import { useActionState, useEffect, useState } from "react";
import { updatePassword } from "../services/utils";
import { useNavigate } from "react-router";
import { LuEye, LuEyeOff } from "react-icons/lu";

function UpdatePasswordForm() {
    // State variables to manage form visibility and messages
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [data, action, isPending] = useActionState(updatePassword, {
        succMsg: null,
        errMsg: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (data.succMsg) {
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 3000);
        }
    }, [data, navigate]);

    return (
        <form className={`w-full md:w-2/3 xl:w-1/2 2xl:w-1/3 bg-white shadow-md rounded px-1 md:px-4 xl:px-8 pt-6 ${(data.succMsg || data.errMsg) ? "pb-0" : "pb-8"} mx-auto my-5`} action={action}>
            <legend className="font-bold my-3">Update Password</legend>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    New Password:
                </label>
                <div className="w-full relative">
                    <input
                        type={showPass ? "text" : "password"}
                        id="password"
                        name="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <button type="button" className="absolute right-2 top-2" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <LuEyeOff className="text-gray-500" /> : <LuEye className="text-gray-500" />}
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm Password:
                </label>
                <div className="w-full relative">
                    <input
                        type={showConfirmPass ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                    <button type="button" className="absolute right-2 top-2" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                        {showConfirmPass ? <LuEyeOff className="text-gray-500" /> : <LuEye className="text-gray-500" />}
                    </button>
                </div>
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isPending || data.succMsg}
            >
                {isPending ? "Updating..." : "Update Password"}
            </button>

            {
                (data.succMsg || data.errMsg) && (<div className="my-5 h-8 text-center">
                    <h2 className="text-2xl font-bold my-5">Password Update Status</h2>
                    {data?.succMsg && <p className="text-green-500">{data.succMsg}</p>}
                    {data?.errMsg && <p className="text-red-500">{data.errMsg}</p>}
                </div>)
            }
        </form>
    )
}

export default UpdatePasswordForm;