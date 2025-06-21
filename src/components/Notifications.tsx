import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants/constants';
import { hasDateTimePassed } from '../services/utils';
import { MdOutlineNotificationsActive } from "react-icons/md";

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

    return (
        <div>
            <span onClick={handleNotificationClick} className="relative cursor-pointer px-2 py-1 rounded-lg shadow-lg">
                <span className='absolute top-1.5 right-0.5'>{notificationCount}</span>
                <span><MdOutlineNotificationsActive /></span>
            </span>

            {
                (showNotifications && notifications.length > 0) ? (
                    <ul className="bg-white p-4 rounded-lg shadow-lg mt-2">
                        {notifications.reverse().map((notification, index) => (
                            <li key={index} className="text-black mb-2">{notification}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="bg-white text-gray-500 mt-2">No notifications</div>
                )
            }
        </div>
    )
}

export default Notifications;