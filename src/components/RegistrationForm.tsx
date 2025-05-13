import { Link } from "react-router";
import FormBtn from "./FormBtn";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function RegistrationForm() {
  const [nameInputValue, setNameInputValue] = useState("");
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [confirmPassInputValue, setConfirmPassInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <form className="border rounded-lg p-5 backdrop-blur-md" aria-labelledby="registration-form-heading">
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
  )
}

export default RegistrationForm;