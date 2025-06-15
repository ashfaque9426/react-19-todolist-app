import React from 'react';
import { v4 as uuidv4 } from 'uuid';

type dataObj = {
    ID: string;
    Date: string;
    Title: string;
    Number: number;
}

type ParamsType = {
    dataArray: dataObj[];
    showTableDataSetter: (show: boolean) => void;
    setTitle: (title: string) => void;
};

function ShowDataCards({ dataArray, showTableDataSetter, setTitle }: ParamsType) {
    if (!dataArray || dataArray.length === 0) {
        return <div className="text-center text-gray-500">No data available</div>;
    }

    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        const titleElement = e.currentTarget.querySelector('.title');
        const title = titleElement?.textContent;
        setTitle(title || '');
        showTableDataSetter(true);
    }
    
    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-black">
            {dataArray.map((data) => (
                <li onClick={handleClick} key={uuidv4()} className="bg-white p-4 rounded-lg shadow mb-4">
                    <article>
                        <h3 className="title text-lg font-semibold mb-2">{data.Title}</h3>
                        <p><span className='font-semibold'>Date:</span> {data.Date}</p>
                        <p className=""><span className='font-semibold'>Number:</span> {data.Number}</p>
                        <button className='px-2 py-1 bg-black text-white cursor-pointer mt-3.5 rounded-lg'>Click To view list details</button>
                    </article>
                </li>
            ))}
        </ul>
    )
}

export default ShowDataCards;