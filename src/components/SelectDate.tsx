import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

function SelectDate({ selectedDate, setSelectedDate }: { selectedDate: string, setSelectedDate: (date: string) => void}) {
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
                }
            } catch (error) {
                console.error("Error fetching todo dates: ", error);
                setErr("Failed to fetch todo dates.");
            }
        }

        fetchDates()
    }, [axiosSecure]);

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedDate(event.target.value);
    };
    return (
        <>
            {
                !err ? (
                    <div className="w-full flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">{selectedDate}</span>

                        {
                            dates.length > 0 ? <span className="px-2 py-1 border rounded-lg cursor-pointer">
                                <label htmlFor="date-select">Select a date:</label>
                                <select id="date-select" value={selectedDate} onChange={handleDateChange}>
                                    {dates.map((date: string) => (
                                        <option key={date} value={date}>
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