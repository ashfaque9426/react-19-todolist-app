function ShowDataTable({ showTableDataSetter, date, title, setTitle }: { showTableDataSetter: (show: boolean) => void , date: string, title: string, setTitle: (title: string) => void }) {
    const handleClick = () => {
        showTableDataSetter(false);
        setTitle("");
    }

    return (
        <div>
            <button className="px-2 py-1 bg-black text-white font-semibold text-lg rounded-lg cursor-pointer mb-3.5" onClick={handleClick}>Previous</button>
            <p className="font-semibold text-lg"><span>Date: {date}</span> <span>Title: {title}</span></p>
        </div>
    )
}

export default ShowDataTable;