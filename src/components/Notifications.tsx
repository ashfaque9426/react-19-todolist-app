import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants/constants';
import { errorHandler, hasDateTimePassed } from '../services/utils';
import { MdOutlineNotificationsActive } from "react-icons/md";
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { v4 as uuidv4 } from 'uuid';

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
    const [compLoaded, setCompLoaded] = useState(false);

    const { user, fetchNotifications, setFetchNotifications } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (showNotifications) {
            setNotificationCount(0);
        }
    }

    useEffect(() => {
        if (user) setCompLoaded(true);
    }, [user]);

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
        if (!(record.date && record.date === new Date().toISOString().split('T')[0])) return;
    
        const waitUntilTimePassed = async (date: string, time: string) => {
            while (!hasDateTimePassed(date, time)) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
            }
        };
    
        const checkTimesSequentially = async () => {
            for (let i = 0; i < record.times.length; i++) {
                const time = record.times[i];
                await waitUntilTimePassed(record.date, time); // wait until passed
                setNotifications(prev => [...prev, `Your scheduled for time: ${time} has just passed. Notification at: ${time}`]);
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

                if (JSON.stringify(dataObj) !== JSON.stringify(record)) {
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

        if (compLoaded || fetchNotifications) {
            fetchTodoTimesForToday();
            if (fetchNotifications) setFetchNotifications(false);
        }

        fetchTodoTimesForToday();
    }, [user, axiosSecure, record, fetchNotifications, setFetchNotifications, compLoaded]);

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
                                {notifications.reverse().map((notification) => (
                                    <li key={uuidv4()} className="relative text-black">
                                        <span>{notification.split(". ")[0]}</span>
                                        <small className="absolute bottom-0 right-0 text-xs text-gray-500">{notification.split(". ")[1]}</small>    
                                    </li>
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