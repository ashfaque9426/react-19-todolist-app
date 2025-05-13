function HomePage() {

    return (
        <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
            bg-[url('../assets/images/background/todo-bg-mobile.webp')] 
            md:bg-[url('../assets/images/background/todo-bg-tablet.webp')] 
            lg:bg-[url('../assets/images/background/todo-bg-desktop.webp')] 
            px-2 md:px-3.5 lg:px-5 flex flex-col justify-center text-white`}>
            <h1 id='main-component' className='text-2xl text-center font-bold my-3.5'>My Lists</h1>
            <div>
                <section className='my-5' role='region' aria-labelledby='todo-list-section'>
                    <h2 id='todo-list-section' className='text-xl font-semibold my-3.5'>Title</h2>
                    <ul></ul>
                </section>
            </div>
        </div>
    )
}

export default HomePage;
