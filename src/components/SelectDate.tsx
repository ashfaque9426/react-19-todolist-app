function SelectDate({ selectedDate, setSelectedDate, datesArr, errMsg }: { selectedDate: string, setSelectedDate: (date: string) => void, datesArr: string[], errMsg?: string }) {
    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedDate(event.target.value);
    };
    return (
        <>
            {
                !errMsg ? (
                    <div className="w-full flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">{selectedDate}</span>

                        {
                            datesArr.length > 0 ? <span className="px-2 py-1 border rounded-lg cursor-pointer">
                                <label htmlFor="date-select">Select a date:</label>
                                <select id="date-select" value={selectedDate} onChange={handleDateChange}>
                                    {datesArr.map((date: string) => (
                                        <option key={date} value={date}>
                                            {date}
                                        </option>
                                    ))}
                                </select>
                            </span> : <span className="px-2 py-1 border rounded-lg cursor-pointer">{selectedDate}</span>
                        }
                    </div>
                ) : (
                    <p className="w-full mb-4 text-center text-red-500">{errMsg}</p>
                )
            }
        </>
    )
}

export default SelectDate;