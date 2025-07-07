import { useParams } from "react-router";
import { FormState, RecordData } from "../services/dataTypes";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { errorHandler, formatTimeTo12Hour, isPastDate, showToast } from "../services/utils";
import TodoForm from "../components/TodoForm";
import useAuth from "../hooks/useAuth";

function EditTodo() {
    const [recordData, setRecordData] = useState<RecordData | null>(null);
    const [axiosSecure] = useAxiosSecure();
    const { recordId } = useParams<{ recordId: string }>();
    const recordIdNumber = recordId ? parseInt(recordId, 10) : null;
    const { setFetchNotifications, setRenderComp, setTitleFromEdit, timeFromEdit, setTimeFromEdit } = useAuth();

    useEffect(() => {
        const fetchTodoRecord = async () => {
            if (!recordId || !axiosSecure) {
                const warningMsg = !recordId ? "Record Id is required to edit existing todo record" : "User is not logged in. Unauthorized Access."
                showToast(warningMsg, "warning");
                return;
            }
            try {
                const response = await axiosSecure.get(`api/get-todo-record?recordId=${recordId}`, { withCredentials: true });
                const { recordData, errMsg } = response.data;

                if (errMsg) {
                    showToast(errMsg, 'error');
                } else if (recordData) {
                    setRecordData(recordData);
                }
            } catch (error) {
                errorHandler(error, false);
                showToast('Failed to fetch todo record.', 'error');
            }
        }

        fetchTodoRecord();
    }, [axiosSecure, recordId]);

    const handleTodoEdit = async (
        _prevState: FormState,
        formData: FormData
    ): Promise<FormState> => {
        if (!recordIdNumber) {
            return { success: '', error: 'Invalid record ID.' };
        }

        try {
            const date = formData.get('date') as string;
            const time = formData.get('time') as string;
            const convertedTime = formatTimeTo12Hour(time);
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const status = formData.get('status') as string;

            const payload = {
                date,
                title,
                description,
                time: convertedTime,
                status,
                recordId: recordIdNumber
            };

            if(isPastDate(date)) {
                return { success: '', error: 'The date is you trying to add after edit is past date.' };
            }

            const response = await axiosSecure.patch('/api/modify-todo-record', payload);
            const { succMsg, errMsg } = response.data;

            if (errMsg) {
                return { success: '', error: errMsg };
            }
            
            showToast(succMsg, 'success');

            if(timeFromEdit !== convertedTime) setFetchNotifications(true);
            setTimeFromEdit("");
            setTitleFromEdit(title);
            setRenderComp('render ShowDataLists comp');
            return { success: 'Form submitted successfully', error: '' };
        } catch (error) {
            const { setErrMsgStr } = errorHandler(error, true);
            return { success: '', error: setErrMsgStr };
        }
    }
    return (
        <div className={`h-[calc(100vh-48px)] w-full bg-no-repeat bg-cover bg-center relative 
            bg-[url('../assets/images/background/todo-edit-bg-mobile.webp')] 
            md:bg-[url('../assets/images/background/todo-edit-bg-tablet.webp')] 
            lg:bg-[url('../assets/images/background/todo-edit-bg-desktop.webp')] 
            px-2 md:px-3.5 lg:px-5 text-white`}>
            <h1 className="font-semibold text-2xl text-center py-12">Modify Todo Record</h1>

            <TodoForm onSubmit={handleTodoEdit} editTodo={true} recordData={recordData} />
        </div>
    )
}

export default EditTodo;