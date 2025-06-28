export const apiUrl = import.meta.env.VITE_API_URL;

export const loginUrl = `${apiUrl}/api/user-login`;
export const logoutUrl = `${apiUrl}/api/user-logout`;
export const registerUrl = `${apiUrl}/api/register-user`;

export const verifyEmailBackendUrl = `${apiUrl}/api/verify-email`;
export const updatePassBackendUrl = `${apiUrl}/api/update-password`;

export const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;
export const LOCAL_STORAGE_KEY_NOTIFICATIONS = import.meta.env.VITE_LOCAL_STORAGE_KEY_NOTIFICATIONS;
export const LOCAL_STORAGE_KEY_NOTIFY_COUNT = import.meta.env.VITE_LOCAL_STORAGE_KEY_NOTIFY_COUNT;