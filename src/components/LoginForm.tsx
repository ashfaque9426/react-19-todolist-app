import FormBtn from "./FormBtn";

function LoginForm() {
  return (
    <form className="flex flex-col justify-center gap-3.5 px-3 border rounded-lg pb-5">
        <legend className="font-semibold text-2xl -mt-5"><span className="bg-white ml-1.5">LoginForm</span></legend>

        {/* email */}
        <div className="flex flex-col gap-2.5">
          <label className="font-semibold text-xl" htmlFor="Email">Email:</label>
          <input className="border rounded-lg px-2 py-0.5 outline-0" type="email" name="Email" id="Email" placeholder="Please enter your email" required autoComplete="true"/>
        </div>

        {/* password */}
        <div className="flex flex-col gap-2.5">
          <label className="font-semibold text-xl" htmlFor="Password">Password:</label>
          <input className="border rounded-lg px-2 py-0.5 outline-0" type="password" name="Password" id="Password" placeholder="Please enter your password" required />
        </div>

        {/* login button */}
        <FormBtn />
    </form>
  )
}

export default LoginForm;