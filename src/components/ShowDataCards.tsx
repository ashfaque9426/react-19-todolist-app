function ShowDataCards({ dataArray, showListsSetter }: { dataArray: unknown[], showListsSetter: (value: boolean) => void }) {
    if (!dataArray || dataArray.length === 0) {
        return <div className="text-center text-gray-500">No data available</div>;
    }

    const handleClick = () => {
        showListsSetter(false);
    }

    return (
        <div>
            <button onClick={handleClick}>Previous</button>
            <ul>
                {dataArray.map((data, index) => (
                    <li key={`${index} for_data_card_list`} className="bg-white p-4 rounded-lg shadow mb-4">
                        <pre className="text-gray-800">{JSON.stringify(data, null, 2)}</pre>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ShowDataCards;