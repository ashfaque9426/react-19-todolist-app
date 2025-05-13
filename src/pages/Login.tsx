import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
      bg-[url('../assets/images/background/login-bg-mobile.webp')]
      md:bg-[url('../assets/images/background/login-bg-tablet.webp')]
      lg:bg-[url('../assets/images/background/login-bg-desktop.webp')]
      px-2 md:px-3.5 lg:px-5 flex flex-col justify-center text-white`}>
      {/* overlay */}
      <div className="absolute inset-0 bg-black opacity-35 z-0" />
      
      <section id="main-component" className="flex flex-col justify-center gap-5 w-full md:max-w-[400px] mx-auto z-10" role="region" aria-labelledby="User-Login">
        <h1 id="User-Login" className="text-[1.7rem] font-bold text-center underline">User Login Form</h1>

        <LoginForm />
      </section>
    </div>
  )
}

export default Login;