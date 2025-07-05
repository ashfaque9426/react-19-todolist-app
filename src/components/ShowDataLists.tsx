import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { errorHandler, isPastDate, showToast } from "../services/utils";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import useWindowWidth from "../hooks/useWindowWidth";

type TodoRecord = {
    ID: string;
    Date: string;
    Title: string;
    Description: string;
    Time: string;
    Status: string;
    UserID: string;
};

function ShowDataLists({ showTableDataSetter, date, title, setTitle, titleFromEditSetter }: { showTableDataSetter: (show: boolean) => void, date: string, title: string, setTitle: (title: "") => void, titleFromEditSetter: (title: "") => void }) {
    const [recordDataArr, setRecordDataArr] = useState<TodoRecord[]>([]);
    const [isPending, setPending] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { user, setFetchNotifications, setCompHeight, navHeight, footerHeight } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const winWidth = useWindowWidth();

    useEffect(() => {
        if (navHeight === 0 || footerHeight === 0) return;
        if ((winWidth <= 1024 && recordDataArr.length > 1) || (winWidth > 1024 && recordDataArr.length > 2)) {
            setCompHeight("auto");
        }
    }, [recordDataArr.length, setCompHeight, navHeight, footerHeight, winWidth]);

    useEffect(() => {
        const fetchData = async () => {
            if (!date || !title || !user || !axiosSecure) return;

            try {
                const { dataArr, errMsg } = (await axiosSecure.get(`/api/get-todo-records?userId=${user.userId}&date=${date}&title=${title}`)).data;
                if (errMsg) {
                    setErrorMsg(errMsg);
                } else if (dataArr) {
                    if (errMsg) setErrorMsg("");
                    setRecordDataArr(dataArr);
                }
            } catch (err) {
                const { setErrMsgStr } = errorHandler(err, true);
                setErrorMsg(setErrMsgStr);
            }
        }
        fetchData();
    }, [date, title, user, axiosSecure]);

    const handleClick = () => {
        setErrorMsg("");
        setRecordDataArr([]);
        setTitle("");
        titleFromEditSetter("");
        showTableDataSetter(false);
        const heightValue = `calc(100vh - ${navHeight + footerHeight + 11}px)`;
        setCompHeight(heightValue);
    }

    const handleComeplete = async (recordId: string, date: string) => {
        if(!user || !axiosSecure) return;
        else if (!recordId || !date) {
            showToast("Record ID and Date parameter values are required to complete a record.", "error");
            return;

        }
        setPending(true);
        try {
            const res = await axiosSecure.patch('/api/complete-todo-record', { userId: user.userId, recordId, date });

            if (res.data.errMsg) {
                showToast(res.data.errMsg, "error");
            } else {
                showToast(res.data.succMsg, 'success');
                setRecordDataArr(prev => prev.map(record => record.ID === recordId ? { ...record, Status: "completed" } : record));
            }
        } catch (err) {
            const { setErrMsgStr } = errorHandler(err, true);
            setErrorMsg(setErrMsgStr);
        }
        setPending(false);
    }

    const handleDelete = async (recordId: string) => {
        if (!user || !axiosSecure) return;
        setPending(true);
        try {
            const res = await axiosSecure.delete(`/api/delete-todo-record/recordId=${recordId}`);
            if (res.data.errMsg) {
                setErrorMsg(res.data.errMsg);
            } else {
                showToast(res.data.succMsg, 'success');
                setRecordDataArr(prev => prev.filter(record => record.ID !== recordId));
                setFetchNotifications(true);
            }
        } catch (err) {
            const { setErrMsgStr } = errorHandler(err, true);
            setErrorMsg(setErrMsgStr);
        }
        setPending(false);
    }

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
                                    <li key={uuidv4()} className="bg-white p-4 rounded-lg shadow mb-8">
                                        <article className="p-4 flex flex-col xl:flex-row justify-between items-start gap-4">
                                            <div className="flex flex-wrap gap-5">
                                                <div>
                                                    <span className="font-semibold">Checkmark:</span><br />
                                                    <button onClick={() => handleComeplete(data.ID, data.Date)} disabled={isPastDate(data.Date) || data.Status === "completed" || isPending} className='cursor-pointer mt-1.5 rounded-lg disabled:cursor-not-allowed'>{data.Status === 'completed' ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}</button>
                                                </div>
                                                <p><span className='font-semibold'>Date:</span><br /> {data.Date}</p>
                                                <p><span className='font-semibold'>Time:</span><br /> {data.Time}</p>
                                                <p><span className='font-semibold'>Description:</span><br /> {data.Description}</p>
                                                <p><span className='font-semibold'>Status:</span><br /> {data.Status}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <button onClick={() => navigate(`/edit-todo/${data.ID}`)} disabled={isPastDate(data.Date) || isPending} className='px-2 py-1 bg-black text-white cursor-pointer mt-3.5 rounded-lg disabled:text-gray-500 disabled:cursor-not-allowed'>Edit</button>
                                                <button onClick={() => handleDelete(data.ID)} disabled={isPastDate(data.Date) || isPending} className='px-2 py-1 bg-red-500 text-white cursor-pointer mt-3.5 rounded-lg disabled:bg-red-300 disabled:text-gray-100 disabled:cursor-not-allowed'>{!isPending ? "Delete" : "Deleting..."}</button>
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