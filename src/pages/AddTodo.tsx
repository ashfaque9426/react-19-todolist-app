import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FormState } from "../services/dataTypes";
import { errorHandler, formatTimeTo12Hour } from "../services/utils";

function AddTodo() {
    const [arrOfTitles, setArrOfTitles] = useState<string[] | []>([]);
    // get user data from auth context
    const { user, setFetchNotifications, setRenderComp } = useAuth();
    // get axios instance with secure headers from custom hook
    const [axiosSecure] = useAxiosSecure();

    useEffect(() => {
        const fetchTodoTitles = async () => {
            if (!user || !axiosSecure) return;

            try {
                const response = await axiosSecure.get(`/api/get-todo-titles?userId=${user.userId}`);
                const { titleArr, errMsg } = response.data;

                if (errMsg) {
                    console.error(errMsg);
                } else {
                    setArrOfTitles(titleArr);
                }
            } catch (error) {
                errorHandler(error, false);
            }
        };

        fetchTodoTitles();
    }, [user, axiosSecure]);

    // handle form submission for adding a todo record
    const handleFormSubmission = async (
        _prevState: FormState,
        formData: FormData
    ): Promise<FormState> => {
        if (!user || !user.userId) {
            return { success: '', error: 'User is not logged in or user data has been deleted by user accidentally.' };
        }

        try {
            const date = formData.get('date') as string;
            const time = formData.get('time') as string;
            const convertedTime = formatTimeTo12Hour(time);
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const status = 'not completed';

            // Example logic, replace with your backend call
            const payload = { date, time: convertedTime, title, description, status, userId: user.userId };

            // Make a POST request to add the todo record
            const response = await axiosSecure.post('/api/add-todo-record', payload);
            const { succMsg, errMsg } = response.data;

            // If there is an error message, return it
            if (errMsg) {
                return { success: '', error: errMsg };
            }

            // If the record is added successfully, update the setFetchNotification state to fetch notifications from AuthProvider
            setFetchNotifications(true);

            // which component to render set state
            setRenderComp('render ShowDataCards comp');

            // return success message
            return { success: succMsg, error: '' };
            
        } catch (error) {
            const { setErrMsgStr } = errorHandler(error, true);
            return { success: '', error: setErrMsgStr };
        }
    };

    return (
        <div className={`w-full h-[calc(100vh-48px)] bg-no-repeat bg-cover bg-center relative 
            bg-[url('../assets/images/background/todo-edit-bg-mobile.webp')] 
            md:bg-[url('../assets/images/background/todo-edit-bg-tablet.webp')] 
            lg:bg-[url('../assets/images/background/todo-edit-bg-desktop.webp')] 
            px-2 md:px-3.5 lg:px-5 text-white`}>
            
            {/* add todo record page heading */}
            <h1 className="font-semibold text-2xl text-center py-12">Add Todo Record</h1>

            {/* Todo Form for adding todo record */}
            <TodoForm onSubmit={handleFormSubmission} titleArr={arrOfTitles} />
        </div>
    )
}

export default AddTodo;