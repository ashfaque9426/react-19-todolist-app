import React, { useActionState, useEffect, useState } from 'react';
import { FormState } from '../services/dataTypes';
import { v4 as uuidv4 } from 'uuid';

type Props = {
    onSubmit: (
        prevState: FormState,
        formData: FormData
    ) => Promise<FormState>;
    editTodo?: boolean;
};

const TodoForm: React.FC<Props> = ({ onSubmit, editTodo }) => {
    const [titleArr, setTitleArr] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [showTitleInput, setShowTitleInput] = useState<boolean>(false);
    const [state, formAction] = useActionState(onSubmit, {
        success: '',
        error: '',
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTitle(e.target.value);
    };

    const handleShowTitleInput = () => {
        setShowTitleInput(true);
    }

    useEffect(() => {
        if (editTodo) {
            setTitleArr([]);
        }
    }, [editTodo]);

    return (
        <form action={formAction} className="max-w-md mx-auto p-6 bg-black text-white rounded-2xl shadow-lg space-y-6">
            {/* Date Field */}
            <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="w-full p-2 rounded-md bg-white text-black"
                />
            </div>

            {/* Time Field */}
            <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1">
                    Time
                </label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className="w-full p-2 rounded-md bg-white text-black"
                />
            </div>

            {/* select field for titles */}
            {
                (editTodo && !showTitleInput) ? (
                    <div className="flex justify-between lg:justify-baseline items-center">
                        {
                            titleArr.length > 0 && (<span className="cursor-pointer">
                                <label className="text-lg font-semibold mr-1.5 cursor-text" htmlFor="title-select">Select a Title:</label>
                                <select className="px-2 py-1 border rounded-lg focus:outline-0" id="title-select" name='title' value={selectedTitle} onChange={handleTitleChange}>
                                    {titleArr.map((title: string) => (
                                        <option className="text-black" key={uuidv4()} value={title}>
                                            {title}
                                        </option>
                                    ))}
                                </select>
                            </span>)
                        }
                        <button onClick={handleShowTitleInput} className="text-lg px-2 py-1 bg-black text-white cursor-pointer">Add New Title</button>
                    </div>)
                : (<div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full p-2 rounded-md bg-white text-black"
                    />
                </div>)
            }

            {/* Description Field */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    className="w-full p-2 rounded-md bg-white text-black resize-none"
                />
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                    Submit
                </button>
            </div>

            {/* Success/Error Message */}
            {state.success && <p className="text-green-400">{state.success}</p>}
            {state.error && <p className="text-red-400">{state.error}</p>}
        </form>
    );
};

export default TodoForm;