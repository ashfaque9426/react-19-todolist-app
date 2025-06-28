import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { updatePassBackendUrl, verifyEmailBackendUrl } from "../constants/constants";
import axios from "axios";
import LoadingData from "../components/LoadingData";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { errorHandler } from "../services/utils";
import { decodeJwt } from "jose"

function EmailVerificationAndPassUpdate() {
    const [tokenAvailable, setTokenAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formSubmitStatus, setFormSubmitStatus] = useState(false);
    const [err, setErr] = useState(false);
    const [formPassVisibility, setFormPassVisibility] = useState(false);
    const [formConfirmPassVisibility, setFormConfirmPassVisibility] = useState(false);
    const [pageHeading, setPageHeading] = useState("");
    const [verifyEmailMsgStatus, setVerifyEmailMsgStatus] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPass, setNewConfirmPass] = useState("");
    const [formSuccMsg, setFormSuccMsg] = useState("");
    const [formErrMsg, setFormErrMsg] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const password = form.password;
        const confirmPassword = form.confirmPassword;

        if (!password || !confirmPassword) return;
        else if (newPassword !== newConfirmPass) {
            setFormErrMsg("Password and confirm password do not match");
            return;
        }
        setFormSubmitStatus(true);
    };

    useEffect(() => {
        let errStr = "";

        if (!token || !/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
            setErr(true);
            setVerifyEmailMsgStatus('Invalid token. Unauthorized Access.');
            setLoading(false);
        }

        const decoded = token ? decodeJwt(token) : undefined;
        const isExpired = decoded?.exp ? Date.now() >= decoded.exp * 1000 : false;

        if (window.location.href.includes('/verify-email')) {
            setPageHeading("Email Verification Status");
            errStr = "Please request a new verification email for email verification."
        } else if (window.location.href.includes('/update-password')) {
            setPageHeading("Please enter you new password bellow");
            errStr = "Please request a new update password email."
        }

        if (!isExpired) {
            setTokenAvailable(true);
        } else {
            setErr(true);
            setVerifyEmailMsgStatus(`Your token has been expired. ${errStr} `);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!(token && tokenAvailable)) return;

        setLoading(true);
        let apiUrl = "";
        let apiReqToMake = "";
        if (window.location.href.includes('/verify-email')) {
            apiUrl = verifyEmailBackendUrl;
            apiReqToMake = "email verification";
        } else if (window.location.href.includes('/update-password')) {
            apiUrl = updatePassBackendUrl;
            apiReqToMake = "password update";
        }

        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:;"'|\\<>,.?/~`]).{8,}$/;
        const isPasswordWeak = !passwordPattern.test(newPassword);

        if (apiReqToMake === "password update" && !formSubmitStatus) {
            setLoading(false);
            return;
        }

        if (apiReqToMake === "password update" && formSubmitStatus && isPasswordWeak) {
            setFormErrMsg("Your password should have at least one UPPERCASE character, one special character eg:(/.,@!), one digit and minimum 8 characters long.");
            setLoading(false);
            return;
        }

        const apiRequest = async (url: string, password: string) => {
            const payload: { token: string; newPassword?: string } = {
                token: token
            };

            if (password.length > 0) payload.newPassword = password;

            try {
                const response = await axios.patch(url, payload);
                const { succMsg, errMsg } = response.data;

                if (errMsg) {
                    if (apiReqToMake === "email verification") {
                        setErr(true);
                        setVerifyEmailMsgStatus(errMsg);
                    } else {
                        setFormErrMsg(errMsg);
                    }
                    setLoading(false);
                    return;
                }

                if (apiReqToMake === "email verification") {
                    setVerifyEmailMsgStatus(succMsg + " You will be redirected to the login page soon.");
                } else if (apiReqToMake === "password update") {
                    setFormSuccMsg(succMsg + " You will be redirected to the login page soon.");
                }

                setTimeout(() => navigate('/login', { replace: true }), 2000);
            } catch (err) {
                const { setErrMsgStr } = errorHandler(err, true);
                if(window.location.href.includes('/update-password')) {
                    setFormErrMsg(setErrMsgStr);
                    setLoading(false);
                    return;
                }
                setErr(true);
                setVerifyEmailMsgStatus(setErrMsgStr || "An Unexpected server error occured. Please try again later.");
                setLoading(false);
            }
        }

        if (apiUrl.length > 0) {
            apiRequest(apiUrl, newPassword);
        }

        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, tokenAvailable, navigate, formSubmitStatus]);
    return (
        <>
            {
                loading && <LoadingData />
            }

            {
                !loading && <h1 className="font-semibold text-2xl text-center my-12">{pageHeading || "Unexpected Error Occured"}</h1>
            }

            {
                (!loading && pageHeading === "Email Verification Status") || (!loading && err && verifyEmailMsgStatus) && <div className="w-full h-screen px-5 flex justify-center items-center">
                    <p className={`text-xl ${err ? "text-red-500" : "text-green-500"}`}>{verifyEmailMsgStatus}</p>
                </div>
            }

            {
                (!loading && pageHeading === "password update") && <form onSubmit={handleSubmit}>
                    <fieldset className="flex flex-col gap-5 border rounded-md shadow-md px-5 py-7">
                        <legend className="font-bold text-2xl text-center mb-7">Update Password</legend>
                        <div className="flex flex-col relative">
                            <label className="font-semibold text-lg" htmlFor="password">Password</label>
                            <input className="px-1.5 py-1 border rounded-md focus:outline-0" type={formPassVisibility ? "text" : "password"} name="password" id="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl" onClick={() => setFormPassVisibility(!formPassVisibility)}>
                                {
                                    formPassVisibility ? <IoEyeOffOutline /> : <IoEyeOutline />
                                }
                            </span>
                        </div>

                        <div className="flex flex-col relative">
                            <label className="font-semibold text-lg" htmlFor="confirmPassword">Confirm Password</label>
                            <input className="px-1.5 py-1 border rounded-md focus:outline-0" type={formConfirmPassVisibility ? "text" : "password"} name="confirmPassword" id="confirmPassword" value={newConfirmPass} onChange={e => setNewConfirmPass(e.target.value)} />
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl" onClick={() => setFormConfirmPassVisibility(!formPassVisibility)}>
                                {
                                    formConfirmPassVisibility ? <IoEyeOffOutline /> : <IoEyeOutline />
                                }
                            </span>
                        </div>

                        <input className="px-2.5 py-1 w-full rounded-lg bg-black hover:bg-gray-600 text-white text-lg font-semibold cursor-pointer my-1" type="submit" disabled={loading} value="Submit" />

                        <div className="h-32 text-center">
                            {
                                (formSuccMsg || formErrMsg) && (
                                    <>
                                        <h2 className="text-2xl font-bold my-5">Form Submission Status</h2>
                                        {formErrMsg && <p className="text-green-500">{formErrMsg}</p>}
                                        {formErrMsg && <p className="text-red-500">{formErrMsg}</p>}
                                    </>
                                )
                            }
                        </div>
                    </fieldset>
                </form>
            }
        </>
    )
}

export default EmailVerificationAndPassUpdate;