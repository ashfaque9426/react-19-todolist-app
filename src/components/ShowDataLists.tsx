import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { errorHandler } from "../services/utils";
import { v4 as uuidv4 } from 'uuid';

type TodoRecord = {
    ID: string;
    Date: string;
    Title: string;
    Description: string;
    Time: string;
    Status: string;
    UserID: string;
};

function ShowDataLists({ showTableDataSetter, date, title, setTitle }: { showTableDataSetter: (show: boolean) => void, date: string, title: string, setTitle: (title: string) => void }) {
    const [recordDataArr, setRecordDataArr] = useState<TodoRecord[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();

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
        showTableDataSetter(false);
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
                                    <li key={uuidv4()} className="bg-white p-4 rounded-lg shadow mb-4">
                                        <article className="p-4 flex flex-col xl:flex-row justify-between items-start gap-4">
                                            <div className="flex flex-wrap gap-4">
                                                <p><span className='font-semibold'>Date:</span><br /> {data.Date}</p>
                                                <p><span className='font-semibold'>Time:</span><br /> {data.Time}</p>
                                                <p><span className='font-semibold'>Description:</span><br /> {data.Description}</p>
                                                <p><span className='font-semibold'>Status:</span><br /> {data.Status}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <button disabled={data.Status === "completed"} className='px-2 py-1 bg-green-500 text-white cursor-pointer mt-3.5 rounded-lg'>{ data.Status === 'completed' ? "Completed" : "Complete?" }</button>
                                                <button className='px-2 py-1 bg-black text-white cursor-pointer mt-3.5 rounded-lg'>Edit</button>
                                                <button className='px-2 py-1 bg-red-500 text-white cursor-pointer mt-3.5 rounded-lg'>Delete</button>
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