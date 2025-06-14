function ShowDataTable({ showTableDataSetter, date, title }: { showTableDataSetter: (show: boolean) => void , date: string, title: string }) {
    const handleClick = () => {
        showTableDataSetter(false);
    }

    return (
        <div>
            <button className="px-2 py-1 bg-black text-white font-semibold text-lg rounded-lg cursor-pointer" onClick={handleClick}>Previous</button>
            <p><span>Date: {date}</span> <span>Title: {title}</span></p>
        </div>
    )
}

export default ShowDataTable;