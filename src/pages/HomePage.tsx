import { useEffect, useState } from "react";
import SelectDate from '../components/SelectDate';
import TodoLists from "../components/TodoLists";
import useAuth from "../hooks/useAuth";
import LoadingData from "../components/LoadingData";
import ShowErrMsg from "../components/ShowErrMsg";

function HomePage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDataTable, setShowDataTable] = useState<boolean>(false);
    const { user, titleFromEdit, setTitleFromEdit } = useAuth();

    useEffect(() => {
        setLoading(true);
        if (titleFromEdit) {
            setSelectedDate(new Date().toISOString().split("T")[0]);
            setTitle(titleFromEdit);
            setShowDataTable(true);
        }
        setLoading(false);
    }, [titleFromEdit]);

    return (
        <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
            bg-[url('../assets/images/background/todo-bg-mobile.webp')] 
            md:bg-[url('../assets/images/background/todo-bg-tablet.webp')] 
            lg:bg-[url('../assets/images/background/todo-bg-desktop.webp')] 
            px-2 md:px-3.5 lg:px-5 flex flex-col text-white`}>
            <div className="absolute inset-0 bg-black opacity-30 z-0" />
            {
                (user && !loading) ? <>
                    <h1 id='main-component' className='text-2xl text-center underline font-bold mt-12 mb-3.5 z-10'>My Todos</h1>
                    <div className="px-1">
                        <section className='relative my-5 w-full md:w-2/3 2xl:w-1/2 mx-auto z-10' role='region' aria-labelledby='todo-list-section'>
                            <div className="px-5">
                                {/* Select date component */}
                                <SelectDate userId={user.userId} selectedDate={selectedDate} setSelectedDate={setSelectedDate} title={title} />

                                {/* todolists component */}
                                <TodoLists userId={user.userId} selectedDate={selectedDate} title={title} setTitle={setTitle} showDataTable={showDataTable} setShowDataTable={setShowDataTable} setTitleFromEdit={setTitleFromEdit} />
                            </div>
                        </section>
                    </div>
                </> : <>
                    {
                        loading ? <LoadingData /> : <ShowErrMsg errMsg="User is not logged in" />
                    }
                </>
            }
        </div>
    )
}

export default HomePage;
