import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY_NOTIFICATIONS } from '../constants/constants';
import { errorHandler, hasDateTimePassed } from '../services/utils';
import { MdOutlineNotificationsActive } from "react-icons/md";
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { v4 as uuidv4 } from 'uuid';

type TimeRecord = {
    id: number | null;
    date: string;
    times: string[];
};

type NotificationRecord = {
    id: number | null;
    date: string;
    notifications: string[];
    notifyCount: number;
}

type TimeArray = Array<TimeRecord>;

type NotificationArray = Array<NotificationRecord>;

const getInitialRecord = (): TimeRecord => {
    const userObj = JSON.parse(localStorage.getItem('udTDLT') || '{}');
    if (Object.keys(userObj).length === 0 || !userObj.userId) {
        return { id: null, date: '', times: [] };
    }
    const storedArr = localStorage.getItem(LOCAL_STORAGE_KEY) || '[]';
    try {
        const parsedArr: TimeArray = JSON.parse(storedArr);
        const filteredArr = parsedArr.filter(record => record.id === userObj.userId && record.date === new Date().toISOString().split('T')[0] && record.id !== null && record.times.length > 0);

        if (filteredArr.length > 0) {
            return filteredArr[0];
        }

        const arrNeededToGetStored = parsedArr.filter(record => record.id !== userObj.userId);
        const notificationsArr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS) || '[]');

        const notificaitonsNeededToGetStored: NotificationArray = notificationsArr.filter((notification: NotificationRecord) => notification.id !== userObj.userId);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(arrNeededToGetStored));
        localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notificaitonsNeededToGetStored));

        return { id: null, date: '', times: [] };
    } catch {
        return { id: null, date: '', times: [] };
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
            const notificationsArr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS) || '[]');
            const notificationsArrToStore = notificationsArr.map((notification: NotificationRecord) => {
                if (notification.id === record.id) {
                    return {
                        ...notification,
                        notifyCount: 0
                    };
                }
                return notification;
            });

            localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notificationsArrToStore));
        }

        setShowNotifications(!showNotifications);
    }

    // timer to check for each minute to date change to update record realtime in later effect.
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
    // This ensures that the component is ready to display notifications when the user is logged in and initial record data has been fetched from local storage.
    useEffect(() => {
        if (user && !compLoaded && Object.keys(record).length > 0) {
            const notificationsArr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS) || '[]');
            const parsedNotificatonsData: NotificationArray = notificationsArr.filter((notification: NotificationRecord) => notification.id === user.userId);
            const notificationsToUpdateState = parsedNotificatonsData.length > 0 ? parsedNotificatonsData[0].notifications : [];
            const notifyCount = parsedNotificatonsData.length > 0 ? parsedNotificatonsData[0].notifyCount : 0;
            setNotifications(notificationsToUpdateState);
            setNotificationCount(notifyCount);
            setCompLoaded(true);
        }
    }, [user, compLoaded, record]);

    // Effect to handle storage changes across tabs
    // This will update the record and notification count when changes are made in other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            try {
                const userObjRaw = localStorage.getItem('udTDLT');
                const userObj = userObjRaw ? JSON.parse(userObjRaw) : null;

                if (!userObj || typeof userObj.userId !== 'number') return;
                if (!event.newValue) return;

                // Handle time records
                if (event.key === LOCAL_STORAGE_KEY) {
                    const records: TimeArray = JSON.parse(event.newValue);
                    const today = new Date().toISOString().split('T')[0];

                    const filteredArr = records.filter(
                        (record) =>
                            record.id === userObj.userId &&
                            record.date === today &&
                            record.id !== null &&
                            Array.isArray(record.times) &&
                            record.times.length > 0
                    );

                    if (filteredArr.length > 0) setRecord(filteredArr[0]);
                }

                // Handle notifications
                if (event.key === LOCAL_STORAGE_KEY_NOTIFICATIONS) {
                    const notificationsArr: NotificationArray = JSON.parse(event.newValue);

                    const filteredNotifications = notificationsArr.filter(
                        (notification) => notification.id === userObj.userId
                    );

                    if (filteredNotifications.length > 0) {
                        setNotificationCount(Number(filteredNotifications[0].notifyCount));
                    }
                }
            } catch (err) {
                console.error('Error processing storage event:', err);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Effect to check if the current date matches the record date and if so, wait for times to pass
    // and notify the user when each time has passed
    useEffect(() => {
        // isCancelled flag inside useEffect to handle cancellation menually.
        let isCancelled = false;

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
                if (isCancelled) return;
                const time = record.times[i];
                await waitUntilTimePassed(record.date, time); // wait until passed
                if (isCancelled) return;

                const notifyStr = `Your scheduled for time: ${time} has just passed. ${record.date}/${time}`;

                // notify the user only if the notify string is not already in notifications state and update the notifications state and update localStorage for notifications and notification count
                setNotifications(prevNotifications => {
                    let newCountToStore = 0;
                    if (!prevNotifications.includes(notifyStr)) {
                        setNotificationCount(prevCount => {
                            const newCount = prevCount + 1;
                            newCountToStore = newCount;
                            return newCount;
                        });
                        const notificationsArr = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFICATIONS) || '[]');
                        const notificationsArrToStore = notificationsArr.map((notification: NotificationRecord) => {
                            if (notification.id === record.id) {
                                return {
                                    ...notification,
                                    notifications: [...notification.notifications, notifyStr],
                                    notifyCount: newCountToStore
                                };
                            }
                            return notification;
                        });

                        localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notificationsArrToStore));
                        return [...prevNotifications, notifyStr];
                    }
                    return prevNotifications;
                });
            }
        };

        checkTimesSequentially();

        return () => {
            isCancelled = true; // Cancel any ongoing async logic
        };
    }, [record, todoTimesFetched]);

    // Effect to fetch todo times for today from the server and update the record state
    // This will also update the localStorage with the new record
    useEffect(() => {
        const todoTimesFetchedForToday = async () => {
            if (!user || !axiosSecure) return;

            const storedArr = localStorage.getItem(LOCAL_STORAGE_KEY) || '[]';
            const parsedArr = JSON.parse(storedArr) as TimeArray;

            try {
                const response = await axiosSecure.get(`/api/get-todo-times-for-today?userId=${user.userId}`);
                const { dataObj, errMsg } = response.data;

                if (errMsg) {
                    console.error("Error fetching todo times for today:", errMsg);
                    return;
                }

                const recordObj = {
                    id: user.userId,
                    date: dataObj.date,
                    times: dataObj.timesArr
                };

                if (record.date !== recordObj.date) {
                    setRecord(recordObj);
                    parsedArr.push(recordObj);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedArr));
                    localStorage.removeItem(LOCAL_STORAGE_KEY_NOTIFICATIONS);
                    setNotifications([]);
                    setNotificationCount(0);
                } else if (JSON.stringify(record.times) !== JSON.stringify(recordObj.times)) {
                    setRecord(recordObj);
                }

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
    }, [user, axiosSecure, record, fetchNotifications, setFetchNotifications, compLoaded, today, todoTimesFetched]);


    return (
        <div className='relative'>
            <div onClick={handleNotificationClick} className="cursor-pointer px-2 py-1 rounded-lg shadow-lg">
                <span className='absolute -top-1.5 -right-0.5'>{notificationCount}</span>
                <span className='text-2xl'><MdOutlineNotificationsActive /></span>
            </div>

            {
                showNotifications && <div className='absolute top-12 w-52 -left-12 bg-white p-4 rounded-lg shadow-lg z-10'>
                    {
                        notifications.length > 0 ? (
                            <ul className=" mt-2">
                                {notifications.reverse().map((notification) => (
                                    <li key={uuidv4()} className="relative text-black font-semibold">
                                        <span>{notification.split(". ")[0]}</span>
                                        <small className="absolute bottom-1 right-0 text-xs text-gray-500">{notification.split(". ")[1].split("/")[0]}/{notification.split(". ")[1].split("/")[1]}</small>
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