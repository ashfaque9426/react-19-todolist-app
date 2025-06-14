import { useState } from "react";
import SelectDate from '../components/SelectDate';
import TodoLists from "../components/TodoLists";

function HomePage() {
    const [selectedDate, setSelectedDate] = useState("");

    return (
        <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
            bg-[url('../assets/images/background/todo-bg-mobile.webp')] 
            md:bg-[url('../assets/images/background/todo-bg-tablet.webp')] 
            lg:bg-[url('../assets/images/background/todo-bg-desktop.webp')] 
            px-2 md:px-3.5 lg:px-5 flex flex-col text-white`}>
            <div className="absolute inset-0 bg-black opacity-30 z-0" />
            <h1 id='main-component' className='text-2xl text-center underline font-bold mt-12 mb-3.5 z-10'>My Todos</h1>
            <div className="px-1">
                <section className='relative my-5 w-full md:w-2/3 2xl:w-1/2 mx-auto z-10' role='region' aria-labelledby='todo-list-section'>
                    <div className="flex flex-col items-center justify-center gap-5">
                        {/* Select date component */}
                        <SelectDate selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                        {/* todolists component */}
                        <TodoLists selectedDate={selectedDate} date={selectedDate} />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default HomePage;
