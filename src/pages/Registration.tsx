import RegistrationForm from "../components/RegistrationForm";

function Registration() {
  return (
    <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
      bg-[url('../assets/images/background/register-bg-mobile.webp')] 
      md:bg-[url('../assets/images/background/register-bg-tablet.webp')] 
      lg:bg-[url('../assets/images/background/register-bg-desktop.webp')] 
      px-2 md:px-3.5 lg:px-5 flex flex-col justify-center text-white`}>
      
      <section className="flex flex-col justify-center gap-5 w-full md:max-w-[400px] mx-auto z-10" role="region" aria-labelledby="User-Registration">
        <h1 id="User-Registration" className="text-[1.7rem] font-bold text-center">User Registration Form</h1>

        <RegistrationForm />
      </section>
    </div>
  )
}

export default Registration;