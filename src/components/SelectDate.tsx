import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { v4 as uuidv4 } from 'uuid';
import { CiSquarePlus } from "react-icons/ci";

function SelectDate({ selectedDate, setSelectedDate, title }: { selectedDate: string, setSelectedDate: (date: string) => void, title: string }) {
    const [dates, setDates] = useState<string[]>([]);
    const [err, setErr] = useState<string | null>(null);

    const [axiosSecure] = useAxiosSecure();

    useEffect(() => {
        const fetchDates = async () => {
            const userData = JSON.parse(localStorage.getItem('udTDLT') || '{}');
            if (!userData || !userData.userId) {
                console.error("User is not logged in or user data has been deleted by user accidentally.");
                return;
            }
            const userId = userData.userId;
            try {
                const { dateArr, errMsg } = (await axiosSecure.get(`/api/get-todo-dates?userId=${userId}`)).data;
                if (errMsg) {
                    setErr(errMsg);
                } else if (dateArr && Array.isArray(dateArr)) {
                    setDates(dateArr);
                    setSelectedDate(dateArr[0] || new Date().toISOString().split('T')[0]);
                }
            } catch (error) {
                console.error("Error fetching todo dates: ", error);
                setErr("Failed to fetch todo dates.");
            }
        }

        fetchDates();
    }, [axiosSecure, setSelectedDate]);

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedDate(event.target.value);
    };
    return (
        <>
            {
                !err ? (
                    <div className="w-full p-3 lg:px-2.5 lg:py-1.5 bg-white opacity-80 rounded-lg flex mt-12 mb-7 shadow-lg">
                        <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1.5 lg:gap-0 text-black">
                            <span className="font-semibold text-lg">Date: {selectedDate}</span>

                            {
                                !title ? (<div className="flex justify-between lg:justify-baseline items-center">
                                    {
                                        dates.length > 0 ? <span className="cursor-pointer">
                                        <label className="text-lg font-semibold mr-1.5 cursor-text" htmlFor="date-select">Select a date:</label>
                                        <select className="px-2 py-1 border rounded-lg focus:outline-0" id="date-select" value={selectedDate} onChange={handleDateChange}>
                                            {dates.map((date: string) => (
                                                <option className="text-black" key={uuidv4()} value={date}>
                                                    {date}
                                                </option>
                                            ))}
                                        </select>
                                    </span> : <span className="px-2 py-1 border rounded-lg cursor-pointer">{selectedDate}</span>
                                    }
                                    <button className="text-[40px] ml-1"><CiSquarePlus /></button>
                                </div>) : <p className="lg:p-2 text-black font-semibold text-lg">{title}</p>
                            }
                        </div>
                    </div>
                ) : (
                    <p className="w-full mb-4 text-center text-red-500">{err}</p>
                )
            }
        </>
    )
}

export default SelectDate;