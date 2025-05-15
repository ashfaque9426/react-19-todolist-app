import { Link, useNavigate } from "react-router";
import FormBtn from "./FormBtn";
import { useActionState, useEffect, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import useAuth from "../hooks/useAuth";

function RegistrationForm() {
  // states to manage input fields stylling logic and password visibility
  const [nameInputValue, setNameInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [confirmPassInputValue, setConfirmPassInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // useNavigate hook to navigate to different routes
  const navigate = useNavigate();

  // destructuring the registerUser and needToVerifyEmail from useAuth hook
  const { registerUser, needToVerifyEmail } = useAuth();

  useEffect(() => {
    // check if the user is already registered or not
    if (needToVerifyEmail) {
      setNameInputValue("");
      setEmailInputValue("");
      setPasswordInputValue("");
      setConfirmPassInputValue("");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  }, [needToVerifyEmail, navigate]);

  // function to handle form submission
  const handleFormSubmission = async (_prevState: unknown, formData: FormData) => {
    const name = formData.get('Name') as string;
    const email = formData.get('Email') as string;
    const password = formData.get('Password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (password !== confirmPassword) {
      return { success: "", error: "Password and Confirm Password do not match." };
    }

    if (!password || passRegex.test(password) === false) {
      return { success: "", error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." };
    }

    const userPayload = {
      userEmail: email,
      userName: name,
      userPassword: password,
      userConfirmPassword: confirmPassword,
    }

    const registerSucceeded = await registerUser(userPayload);

    if (!registerSucceeded) {
      return { success: "", error: "User Registration Failed. Please try again later." };
    }

    return { success: "User Registration Successfull", error: "" };
  }

  // check if the user is already registered or not
  const [state, formAction] = useActionState(handleFormSubmission, { success: "", error: "" });
  const { success, error } = state;

  return (
    <>
      {/* registration form element */}
      <form action={formAction} className="border rounded-lg p-5 backdrop-blur-md" aria-labelledby="registration-form-heading">
        <fieldset className="flex flex-col gap-5">
          <legend id="registration-form-heading" className="font-bold text-2xl text-center mb-5">Registration</legend>
          <div className="flex flex-col justify-center gap-10">
            {/* name */}
            <div className="flex flex-col border-b-2 pb-1.5 relative">
              <input className="peer border-0 outline-0" type="text" name="Name" id="Name" required autoComplete="true" onChange={e => setNameInputValue(e.target.value)} value={nameInputValue} />
              <label className={nameInputValue ? "font-semibold absolute -top-6 text-base" : "font-semibold text-xl absolute top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:-top-3 peer-focus:text-base"} htmlFor="Name">Name</label>
            </div>

            {/* email */}
            <div className="flex flex-col border-b-2 pb-1.5 relative">
              <input className="peer border-0 outline-0" type="email" name="Email" id="Email" required autoComplete="true" onChange={e => setEmailInputValue(e.target.value)} value={emailInputValue} />
              <label className={emailInputValue ? "font-semibold absolute -top-6 text-base" : "font-semibold text-xl absolute top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:-top-3 peer-focus:text-base"} htmlFor="Email">Email</label>
            </div>

            {/* password */}
            <div className="flex flex-col border-b-2 pb-1.5 relative">
              <input className="peer border-0 outline-0" type={showPassword ? "text" : "password"} name="Password" id="Password" required autoComplete="false" onChange={e => setPasswordInputValue(e.target.value)} value={passwordInputValue} />
              <label className={passwordInputValue ? "font-semibold absolute -top-6 text-base" : "font-semibold text-xl absolute top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:-top-3 peer-focus:text-base"} htmlFor="Password">Password</label>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-xl" onClick={() => setShowPassword(!showPassword)}>
                {
                  showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />
                }
              </span>
            </div>

            {/* confirm password */}
            <div className="flex flex-col border-b-2 pb-1.5 relative">
              <input className="peer border-0 outline-0" type={showConfirmPass ? "text" : "password"} name="confirmPassword" id="confirmPassword" required autoComplete="false" onChange={e => setConfirmPassInputValue(e.target.value)} value={confirmPassInputValue} />
              <label className={confirmPassInputValue ? "font-semibold absolute -top-6 text-base" : "font-semibold text-xl absolute top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:-top-3 peer-focus:text-base"} htmlFor="confirmPassword">Confirm Password</label>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-xl" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                {
                  showConfirmPass ? <IoEyeOffOutline /> : <IoEyeOutline />
                }
              </span>
            </div>

            <div className="text-right">
              <Link className="hover:underline cursor-pointer" to="/login">Already have an Account?</Link>
            </div>
          </div>

          {/* login button */}
          <FormBtn />
        </fieldset>
      </form>

      {/* for success or error message */}
      <div className="h-32 text-center">
        {
          (success || error) && (
            <>
              <h2 className="text-2xl font-bold my-5">Registration Status</h2>
              {success && <p className="text-green-500">{success}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </>
          )
        }
      </div>
    </>
  )
}

export default RegistrationForm;