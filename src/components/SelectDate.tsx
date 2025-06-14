import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { v4 as uuidv4 } from 'uuid';

function SelectDate({ selectedDate, setSelectedDate }: { selectedDate: string, setSelectedDate: (date: string) => void }) {
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
                    <div className="w-full relative flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">Date: {selectedDate}</span>

                        {
                            dates.length > 0 ? <span className="cursor-pointer">
                                <label className="text-lg font-semibold mr-1.5" htmlFor="date-select">Select a date:</label>
                                <select className="px-2 py-1 border rounded-lg focus:outline-0" id="date-select" value={selectedDate} onChange={handleDateChange}>
                                    {dates.map((date: string) => (
                                        <option className="text-black" key={uuidv4()} value={date}>
                                            {date}
                                        </option>
                                    ))}
                                </select>
                            </span> : <span className="px-2 py-1 border rounded-lg cursor-pointer">{selectedDate}</span>
                        }
                    </div>
                ) : (
                    <p className="w-full mb-4 text-center text-red-500">{err}</p>
                )
            }
        </>
    )
}

export default SelectDate;