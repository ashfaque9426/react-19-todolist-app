import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants/constants';
import { errorHandler, hasDateTimePassed } from '../services/utils';
import { MdOutlineNotificationsActive } from "react-icons/md";
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';

type TimeRecord = {
    date: string;
    times: string[];
};

const getInitialRecord = (): TimeRecord => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY) || "{ date: '', times: [] }";
    try {
        const parsedValue: TimeRecord = JSON.parse(stored);
        if (parsedValue.date !== "" && parsedValue.date !== new Date().toISOString().split('T')[0]) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return { date: '', times: [] };
        } else if (parsedValue.date !== new Date().toISOString().split('T')[0] && parsedValue.times.length > 0) {
            return parsedValue;
        }
        return { date: '', times: [] };
    } catch {
        return { date: '', times: [] };
    }
};


function Notifications() {
    const [record, setRecord] = useState<TimeRecord>(getInitialRecord);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (showNotifications) {
            setNotificationCount(0);
        }
    }

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(record));
    }, [record]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
                setRecord(JSON.parse(event.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (!record.date || record.date !== new Date().toISOString().split('T')[0]) return;
    
        const waitUntilTimePassed = async (date: string, time: string) => {
            while (!hasDateTimePassed(date, time)) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
            }
        };
    
        const checkTimesSequentially = async () => {
            for (let i = 0; i < record.times.length; i++) {
                const time = record.times[i];
                await waitUntilTimePassed(record.date, time); // wait until passed
                setNotifications(prev => [...prev, `Your scheduled time: ${time} has passed.`]);
                setNotificationCount(prev => prev + 1);
            }
        };
    
        checkTimesSequentially();
    }, [record]); 
    
    useEffect(() => {
        const fetchTodoTimesForToday = async () => {
            if (!user || !axiosSecure) return;
            try {
                const response = await axiosSecure.get(`/api/get-todo-times-for-today?userId=${user.userId}`);
                const { dataObj, errMsg } = response.data;

                if (errMsg) {
                    console.error("Error fetching todo times for today:", errMsg);
                    return;
                }

                if (JSON.stringify(dataObj.timesArr) !== JSON.stringify(record.times)) {
                    const recordObj = {
                        date: dataObj.date,
                        times: dataObj.timesArr
                    };
                    setRecord(recordObj);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recordObj));
                }
            } catch (error) {
                errorHandler(error, false);
            }
        }

        fetchTodoTimesForToday();
    }, [user, axiosSecure, record]);

    return (
        <div className='relative'>
            <div onClick={handleNotificationClick} className="cursor-pointer px-2 py-1 rounded-lg shadow-lg">
                <span className='absolute -top-1.5 -right-0.5'>{notificationCount}</span>
                <span className='text-2xl'><MdOutlineNotificationsActive /></span>
            </div>

            {
                showNotifications && <div className='md:absolute md:top-12 md:w-40 md:-left-12 bg-white p-4 rounded-lg shadow-lg z-10'>
                    {
                        notifications.length > 0 ? (
                            <ul className=" mt-2">
                                {notifications.reverse().map((notification, index) => (
                                    <li key={index} className="text-black">{notification}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No notifications</div>
                        )
                    }
                </div>
            }
        </div>
    )
}

export default Notifications;