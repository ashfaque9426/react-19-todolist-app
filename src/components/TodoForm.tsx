import React, { useActionState, useEffect, useState } from 'react';
import { FormState, RecordData } from '../services/dataTypes';
import { v4 as uuidv4 } from 'uuid';
import { convertToTimeInputValue } from '../services/utils';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';

type Props = {
    onSubmit: (
        prevState: FormState,
        formData: FormData
    ) => Promise<FormState>;
    editTodo?: boolean;
    recordData?: RecordData | null;
    titleArr?: string[] | [];
};

const TodoForm: React.FC<Props> = ({ onSubmit, editTodo, recordData, titleArr }) => {
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [showTitleInput, setShowTitleInput] = useState<boolean>(false);
    const [state, formAction] = useActionState(onSubmit, {
        success: '',
        error: '',
    });

    const { renderComp, setRenderComp, setTimeFromEdit } = useAuth();

    const navigate = useNavigate();

    const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTitle(e.target.value);
    };

    const handleShowTitleInput = () => {
        setShowTitleInput(true);
    }

    // component render instructions based on render comp state
    useEffect(() => {
        if (renderComp === 'render ShowDataCards comp' || renderComp === 'render ShowDataLists comp') {
            setRenderComp('');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [renderComp, setRenderComp, navigate]);

    // on edit mode it will fetch the todo record data according to the recordId
    useEffect(() => {
        if (editTodo && recordData) {
            const date = recordData.todo_date;
            const time = convertToTimeInputValue(recordData.todo_time);
            setDate(date);
            setTime(time);
            setTimeFromEdit(recordData.todo_time);
            setTitle(recordData.todo_title);
            setDescription(recordData.todo_description);
        }
    }, [editTodo, recordData, setTimeFromEdit]);

    return (
        <form action={formAction} className="max-w-md mx-auto p-6 bg-[#d1b8b8] rounded-2xl shadow-lg space-y-6">
            {/* Date Field */}
            <div>
                <label htmlFor="date" className="block text-lg font-semibold mb-1">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-white text-black focus:outline-none"
                />
            </div>

            {/* Time Field */}
            <div>
                <label htmlFor="time" className="block text-lg font-semibold mb-1">
                    Time
                </label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-white text-black focus:outline-none"
                />
            </div>

            {/* select field for titles */}
            {
                ((!showTitleInput && !editTodo) && (titleArr && titleArr.length > 0)) ? (
                    <div className="flex items-end">
                        <span className="w-2/3 cursor-pointer">
                            <label className="text-lg font-semibold cursor-text" htmlFor="title-select">Select a Title</label>
                            <select className="mt-1 ps-2 py-1 w-full border rounded-lg focus:outline-0 font-semibold" id="title-select" name='title' value={selectedTitle} onChange={handleTitleChange}>
                                {titleArr.map((title: string) => (
                                    <option className="text-black" key={uuidv4()} value={title}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <span onClick={handleShowTitleInput} className="w-1/3 ml-2.5 p-1 bg-white text-black text-center font-semibold hover:bg-gray-200 transition rounded-md cursor-pointer">Add Title</span>
                    </div>)
                    : (<div>
                        <label htmlFor="title" className="block text-sm font-semibold mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 rounded-md bg-white text-black focus:outline-none"
                        />
                    </div>)
            }

            {/* Description Field */}
            <div>
                <label htmlFor="description" className="block text-lg font-semibold mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    placeholder="You can write description 256 characters long max."
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-white text-black resize-none focus:outline-none"
                />
            </div>

            {/* Hidden status field */}
            {
                (editTodo && recordData) && <div className='invisible'>
                    <label htmlFor="status" className="block text-sm font-semibold mb-1">
                        Status
                    </label>
                    <input
                        type="text"
                        id="status"
                        name="status"
                        value={recordData ? recordData.todo_status : ""}
                        className="w-full p-2 rounded-md bg-white text-black resize-none focus:outline-none"
                    />
                </div>
            }

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
            {state.success && <p className="text-[#009500] text-lg leading-relaxed text-center font-semibold">{state.success}</p>}
            {state.error && <p className="text-[#800000] text-lg leading-relaxed text-center font-semibold">{state.error}</p>}
        </form>
    );
};

export default TodoForm;