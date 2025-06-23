import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY_NOTIFICATIONS, LOCAL_STORAGE_KEY_NOTIFY_COUNT } from '../constants/constants';
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
            localStorage.removeItem(LOCAL_STORAGE_KEY_NOTIFICATIONS);
            localStorage.removeItem(LOCAL_STORAGE_KEY_NOTIFY_COUNT);
            return { date: '', times: [] };
        }
        return parsedValue;
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
    const [todoTimesFetched, setTodoTimesFetched] = useState(false);
    const [today, setToday] = useState(new Date());

    const { user, fetchNotifications, setFetchNotifications } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    // handling clicking on the notification icon
    const handleNotificationClick = () => {
        if (showNotifications) {
            setNotificationCount(0);
            localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFY_COUNT, JSON.stringify(0));
        }

        setShowNotifications(!showNotifications);
    }

    useEffect(() => {
        const interval = setInterval(() => {
          const now = new Date();
          // Only update if the date (day) has actually changed
          if (now.toDateString() !== today.toDateString()) {
            // Triggers useEffect
            setToday(now);
          }
        }, 60 * 1000); // check every minute
    
        // cleanup
        return () => clearInterval(interval);
      }, [today]);

    // Effect to set component loaded state when user is available and to fetch initial notifications and notification count from localStorage before connecting to the server
    // This ensures that the component is ready to display notifications when the user is logged in
    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS) || '[]');
        const storedNotificationCount = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFY_COUNT) || '0');
        if (user && !compLoaded && Object.keys(record).length > 0) {
            if (storedNotifications && storedNotifications.length > 0) setNotifications(storedNotifications);
            if (storedNotificationCount > 0) setNotificationCount(storedNotificationCount);
            setCompLoaded(true);
        }
    }, [user, compLoaded, record]);

    // Effect to handle storage changes across tabs
    // This will update the record and notification count when changes are made in other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
                setRecord(JSON.parse(event.newValue));
            }
            if (event.key === LOCAL_STORAGE_KEY_NOTIFY_COUNT && event.newValue) {
                setNotificationCount(Number(event.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Effect to check if the current date matches the record date and if so, wait for times to pass
    // and notify the user when each time has passed
    useEffect(() => {
        // If the record date is not today, do nothing
        if (!(todoTimesFetched && record.date && record.date === new Date().toISOString().split("T")[0] && record.times.length > 0)) return;
    
        // If there are no times, do nothing else waiting for times to pass
        const waitUntilTimePassed = async (date: string, time: string) => {
            while (!hasDateTimePassed(date, time)) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
            }
        };
    
        // Function to check each time sequentially
        // This will wait for each time to pass before notifying the user
        const checkTimesSequentially = async () => {
            for (let i = 0; i < record.times.length; i++) {
                const time = record.times[i];
                await waitUntilTimePassed(record.date, time); // wait until passed
                const notifyStr = `Your scheduled for time: ${time} has just passed. ${record.date}/${time}`;

                // notify the user only if the notify string is not already in notifications state and update the notifications state and update localStorage for notifications and notification count
                setNotifications(prevNotifications => {
                    if (!prevNotifications.includes(notifyStr)) {
                        setNotificationCount(prevCount => {
                            const newCount = prevCount + 1;
                            localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFY_COUNT, JSON.stringify(newCount));
                            return newCount;
                        });
                        localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFICATIONS, JSON.stringify([...prevNotifications, notifyStr]));
                        return [...prevNotifications, notifyStr];
                    }
                    return prevNotifications;
                });
            }
        };
    
        checkTimesSequentially();
    }, [record, compLoaded, todoTimesFetched]);
    
    // Effect to fetch todo times for today from the server and update the record state
    // This will also update the localStorage with the new record
    useEffect(() => {
        const todoTimesFetchedForToday = async () => {
            if (!user || !axiosSecure) return;
            try {
                const response = await axiosSecure.get(`/api/get-todo-times-for-today?userId=${user.userId}`);
                const { dataObj, errMsg } = response.data;
    
                if (errMsg) {
                    console.error("Error fetching todo times for today:", errMsg);
                    return;
                }
    
                const recordObj = {
                    date: dataObj.date || "",
                    times: dataObj.timesArr || []
                };
    
                setRecord(recordObj);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recordObj));
                setTodoTimesFetched(true);
            } catch (error) {
                errorHandler(error, false);
            }
        };
    
        const isDateOutdated = record.date !== today.toISOString().split("T")[0];
    
        if ((fetchNotifications || isDateOutdated) || (compLoaded && !todoTimesFetched)) {
            todoTimesFetchedForToday();
            if (fetchNotifications) setFetchNotifications(false);
        }
    }, [user, axiosSecure, record.date, fetchNotifications, setFetchNotifications, compLoaded, today, todoTimesFetched]);
    

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
                                        <small className="absolute bottom-0 right-0 text-xs text-gray-500">Date:{notification.split(". ")[1].split("/")[0]} Time:{notification.split(". ")[1].split("/")[1]}</small>
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