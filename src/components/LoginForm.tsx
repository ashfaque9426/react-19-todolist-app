import { Link } from "react-router";
import FormBtn from "./FormBtn";

function LoginForm() {
  return (
    <form className="flex flex-col gap-5 border rounded-lg p-5 backdrop-blur-md">
      <legend className="font-bold text-2xl text-center">Login</legend>
      <div className="flex flex-col justify-center gap-10">
        {/* email */}
        <div className="flex flex-col border-b-2 pb-1.5 relative">
          <input className="peer border-0 outline-0" type="email" name="Email" id="Email" required autoComplete="true" />
          <label className="font-semibold text-xl absolute top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:-top-3 peer-focus:text-base" htmlFor="Email">Email</label>
        </div>

        {/* password */}
        <div className="flex flex-col border-b-2 pb-1.5 relative">
          <input className="peer border-0 outline-0" type="password" name="Password" id="Password" required autoComplete="false" />
          <label className="font-semibold text-xl absolute top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:-top-3 peer-focus:text-base" htmlFor="Password">Password</label>
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