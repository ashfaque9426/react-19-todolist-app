function Registration() {
  return (
    <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
      bg-[url('../assets/images/background/register-bg-mobile.jpg')] 
      md:bg-[url('../assets/images/background/register-bg-tablet.jpg')] 
      lg:bg-[url('../assets/images/background/register-bg-desktop.jpg')] 
      px-2 md:px-3.5 lg:px-5 flex flex-col justify-center text-white`}>
      <h1 id='main-component' className='text-2xl text-center font-bold my-3.5'>Register here for an account.</h1>
      <section role="region" aria-labelledby="User-Registration">
        <h2 id="User-Registration" className="text-2xl font-bold text-center">Please Register here.</h2>

        <form action=""></form>
      </section>
    </div>
  )
}

export default Registration;