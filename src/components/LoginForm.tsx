import { Link } from "react-router";
import FormBtn from "./FormBtn";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function LoginForm() {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="flex flex-col gap-5 border rounded-lg p-5 backdrop-blur-md">
      <legend className="font-bold text-2xl text-center">Login</legend>
      <div className="flex flex-col justify-center gap-10">
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

        <div className="flex justify-between items-center">
          <Link className="hover:underline cursor-pointer" to="/register">Don&apos;t have an Account yet?</Link>
          <button className="hover:underline cursor-pointer">Forgot Password?</button>
        </div>
      </div>

      {/* login button */}
      <FormBtn />
    </form>
  )
}

export default LoginForm;