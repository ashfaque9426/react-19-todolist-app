import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <>
      <h1 id='main-component' className='text-2xl text-center font-bold my-3.5'>Login to your account</h1>
      <section className="flex flex-col justify-center gap-5 2xl:w-1/2 mx-auto" role="region" aria-labelledby="User-Login">
        <h2 id="User-Login" className="text-2xl font-bold">Please Login here.</h2>

        <LoginForm />
      </section>
    </>
  )
}

export default Login;