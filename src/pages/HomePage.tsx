import './styles/App.css'

function HomePage() {

    return (
        <>
            <h1 id='main-component' className='text-2xl text-center font-bold my-3.5'>My Lists</h1>
            <div>
                <section className='my-5' role='region' aria-labelledby='todo-list-section'>
                    <h2 id='todo-list-section' className='text-xl font-semibold my-3.5'>Title</h2>
                    <ul></ul>
                </section>
            </div>
        </>
    )
}

export default HomePage;
