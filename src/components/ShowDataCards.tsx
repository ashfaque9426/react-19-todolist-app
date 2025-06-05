import { v4 as uuidv4 } from 'uuid';

type dataObj = {
    Date: string;
    Title: string;
    Number: number;
}

function ShowDataCards({ dataArray, showTableDataSetter }: { dataArray: dataObj[], showTableDataSetter: (show: boolean) => void }) {
    if (!dataArray || dataArray.length === 0) {
        return <div className="text-center text-gray-500">No data available</div>;
    }

    const handleClick = () => {
        showTableDataSetter(true);
    }
    
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dataArray.map((data) => (
                <li onClick={handleClick} key={uuidv4()} className="bg-white p-4 rounded-lg shadow mb-4">
                    <pre className="text-gray-800">{JSON.stringify(data, null, 2)}</pre>
                </li>
            ))}
        </ul>
    )
}

export default ShowDataCards;