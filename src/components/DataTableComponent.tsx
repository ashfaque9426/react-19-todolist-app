import React from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

type TableRow = {
    ID: number;
    Date: string;
    Title: string;
    Description: string;
    Time: string;
    Status: 'completed' | 'not completed';
    UserID: number;
};

type DataTableComponentProps = {
    data: TableRow[];
    onDelete: (itemId: number) => void;
};

const DataTableComponent: React.FC<DataTableComponentProps> = ({ data, onDelete }) => {
    const navigate = useNavigate();
    
    return (
        <div className="overflow-x-auto rounded-lg shadow-md border">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Title</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Edit</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Delete</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={uuidv4()} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{item.Title}</td>
                            <td className="px-4 py-2">{item.Description}</td>
                            <td className="px-4 py-2">{item.Time}</td>
                            <td className="px-4 py-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.Status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : item.Status === 'not completed'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                >
                                    {item.Status}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => navigate(`edit-todo/${item.ID}`)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => onDelete(item.ID)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableComponent;
