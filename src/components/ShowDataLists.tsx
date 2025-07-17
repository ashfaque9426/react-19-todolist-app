// Import React hooks for state, effect, and memoization
import { useCallback, useEffect, useState } from "react";
// Import custom hook for secure Axios instance
import useAxiosSecure from "../hooks/useAxiosSecure";
// Import custom hook for authentication context
import useAuth from "../hooks/useAuth";
// Import utility functions for error handling, date checking, and toast notifications
import { errorHandler, isPastDate, showToast } from "../services/utils";
// Import UUID generator for unique keys
import { v4 as uuidv4 } from 'uuid';
// Import navigation hook from react-router
import { useNavigate } from "react-router";
// Import icons for checkboxes
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
// Import custom hook to get window width
import useWindowWidth from "../hooks/useWindowWidth";

// Define the shape of a todo record
type TodoRecord = {
    ID: string;
    Date: string;
    Title: string;
    Description: string;
    Time: string;
    Status: string;
    UserID: string;
};

// Main component to display todo records for a given date and title
function ShowDataLists({ showTableDataSetter, date, title, setTitle, titleFromEditSetter, parentDataLen }: { showTableDataSetter: (show: boolean) => void, date: string, title: string, setTitle: (title: "") => void, titleFromEditSetter: (title: "") => void, parentDataLen: number }) {
    // State to hold fetched todo records
    const [recordDataArr, setRecordDataArr] = useState<TodoRecord[]>([]);
    // State to track if a record was deleted
    const [dataDeleted, setDataDeleted] = useState(false);
    // State to track if an async operation is pending
    const [isPending, setPending] = useState(false);
    // State to hold error messages
    const [errorMsg, setErrorMsg] = useState("");
    // Get user and several setters from authentication context
    const { user, setFetchNotifications, setFetchDates, setCompHeight, navHeight, footerHeight } = useAuth();
    // Get secure Axios instance
    const [axiosSecure] = useAxiosSecure();
    // Get navigation function
    const navigate = useNavigate();
    // Get current window width
    const winWidth = useWindowWidth();

    // Effect to adjust component height based on navigation/footer height and record count
    useEffect(() => {
        if (navHeight === 0 || footerHeight === 0) return;
        if ((winWidth <= 1024 && recordDataArr.length > 1) || (winWidth > 1024 && recordDataArr.length > 2)) {
            setCompHeight("auto");
        }
    }, [recordDataArr.length, setCompHeight, navHeight, footerHeight, winWidth]);

    // Effect to fetch todo records for the given date and title when dependencies change
    useEffect(() => {
        const fetchData = async () => {
            if (!date || !title || !user || !axiosSecure) return;

            try {
                // Fetch records from API
                const { dataArr, errMsg } = (await axiosSecure.get(`/api/get-todo-records?userId=${user.userId}&date=${date}&title=${title}`)).data;
                if (errMsg) {
                    setErrorMsg(errMsg);
                } else if (dataArr) {
                    if (errMsg) setErrorMsg("");
                    setRecordDataArr(dataArr);
                }
            } catch (err) {
                // Handle errors and set error message
                const { setErrMsgStr } = errorHandler(err, true);
                setErrorMsg(setErrMsgStr);
            }
        }
        fetchData();
    }, [date, title, user, axiosSecure]);

    // Handler for "Previous" button click to reset states and hide table
    const handleClick = useCallback(() => {
        setErrorMsg("");
        setRecordDataArr([]);
        setTitle("");
        titleFromEditSetter("");
        showTableDataSetter(false);
        
        // Adjust component height based on window width and parent data length
        if (winWidth < 768 && parentDataLen < 4) {
            setCompHeight("100vh");
        } else if ((winWidth >= 768 && parentDataLen > 4) || (winWidth > 1279 && parentDataLen > 3)) {
            setCompHeight("auto");
        } else {
            const heightValue = `calc(100vh - ${navHeight + footerHeight}px)`;
            setCompHeight(heightValue);
        }
    }, [setCompHeight, setTitle, showTableDataSetter, titleFromEditSetter, winWidth, parentDataLen, navHeight, footerHeight]);

    // Handler to mark a todo record as completed
    const handleComeplete = async (recordId: string, date: string) => {
        if(!user || !axiosSecure) return;
        else if (!recordId || !date) {
            showToast("Record ID and Date parameter values are required to complete a record.", "error");
            return;
        }
        setPending(true);
        try {
            // Send PATCH request to complete the record
            const res = await axiosSecure.patch('/api/complete-todo-record', { userId: user.userId, recordId, date });

            if (res.data.errMsg) {
                showToast(res.data.errMsg, "error");
            } else {
                showToast(res.data.succMsg, 'success');
                // Update record status in state
                setRecordDataArr(prev => prev.map(record => record.ID === recordId ? { ...record, Status: "completed" } : record));
            }
        } catch (err) {
            // Handle errors and show toast
            const { setErrMsgStr } = errorHandler(err, true);
            showToast(setErrMsgStr, 'error');
        }
        setPending(false);
    }

    // Effect to handle UI updates after a record is deleted
    useEffect(() => {
        if (dataDeleted) {
            if (recordDataArr.length === 0) {
                handleClick();
            }
            setDataDeleted(false);
        }
    }, [recordDataArr.length, dataDeleted, handleClick]);

    // Handler to delete a todo record
    const handleDelete = async (recordId: string, date: string) => {
        if (!user || !axiosSecure) return;
        setPending(true);
        try {
            // Send DELETE request to remove the record
            const res = await axiosSecure.delete(`/api/delete-todo-record/${recordId}/${date}`, { withCredentials: true });
            if (res.data.errMsg) {
                showToast(res.data.errMsg, "error");
            } else {
                showToast(res.data.succMsg, 'success');
                // Remove record from state
                setRecordDataArr(prev => prev.filter(record => record.ID !== recordId));
                // Trigger notifications and date refresh
                setFetchNotifications(true);
                setFetchDates(true);
                setDataDeleted(true);
            }
        } catch (err) {
            // Handle errors and show toast
            const { setErrMsgStr } = errorHandler(err, true);
            showToast(setErrMsgStr, 'error');
        }
        setPending(false);
    }

    // If user or axiosSecure is not available, show a message
    if (!user || !axiosSecure) return <div className="text-center text-gray-500">No user data available</div>;

    return (
        <div>
            <button className="px-2 py-1 bg-black text-white font-semibold text-lg rounded-lg cursor-pointer mb-3.5" onClick={handleClick}>Previous</button>
            {errorMsg && <div className="text-red-500 text-center mb-4">{errorMsg}</div>}
            {
                !errorMsg && <ul className="text-black">
                    {recordDataArr.length === 0 ? (
                        <div className="text-center text-gray-500">No records available for this date and title</div>
                    ) : (
                        <>
                            <h1 className="invisible">{recordDataArr[0].Title}</h1>
                            {
                                recordDataArr.map((data) => (
                                    <li key={uuidv4()} className="bg-white p-5 xl:p-8 rounded-lg shadow mb-8">
                                        <article className="flex flex-col xl:flex-row gap-4">
                                            <div className="flex flex-wrap gap-10 xl:w-[80%]">
                                                <div>
                                                    <span className="font-semibold">Checkmark:</span><br />
                                                    <button onClick={() => handleComeplete(data.ID, data.Date)} disabled={isPastDate(data.Date) || data.Status === "completed" || isPending} className='cursor-pointer mt-1.5 rounded-lg disabled:cursor-not-allowed'>{data.Status === 'completed' ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}</button>
                                                </div>
                                                <p><span className='font-semibold'>Date:</span><br /> {data.Date}</p>
                                                <p><span className='font-semibold'>Time:</span><br /> {data.Time}</p>
                                                <p><span className='font-semibold'>Status:</span><br /> {data.Status}</p>
                                                <p className="xl:w-2/3"><span className='font-semibold'>Description:</span><br /> {data.Description}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 xl:w-[20%]">
                                                <button onClick={() => navigate(`/edit-todo/${data.ID}`)} disabled={isPastDate(data.Date) || isPending} className='px-2 py-1 bg-black text-white text-lg cursor-pointer rounded-lg mt-5 xl:mt-0 disabled:text-gray-500 disabled:cursor-not-allowed'>Edit</button>
                                                <button onClick={() => handleDelete(data.ID, data.Date)} disabled={isPastDate(data.Date) || isPending} className='px-2 py-1 bg-red-500 text-white text-lg cursor-pointer rounded-lg mt-5 xl:mt-0 disabled:bg-red-300 disabled:text-gray-100 disabled:cursor-not-allowed'>{!isPending ? "Delete" : "Deleting..."}</button>
                                            </div>
                                        </article>
                                    </li>
                                ))
                            }
                        </>
                    )}
                </ul>
            }
        </div>
    )
}

export default ShowDataLists;