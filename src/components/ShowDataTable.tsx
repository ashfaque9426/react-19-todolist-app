function ShowDataTable({ showTableDataSetter }: { showTableDataSetter: (show: boolean) => void }) {
    const handleClick = () => {
        showTableDataSetter(true);
    }

    return (
        <div>
            <button onClick={handleClick}>Previous</button>
            <p>Show Table Data By Date</p>
        </div>
    )
}

export default ShowDataTable;