const apiUrl = import.meta.env.VITE_API_URL;

export const loginUrl = `${apiUrl}/api/user-login`;
export const logoutUrl = `${apiUrl}/api/user-logout`;
export const registerUrl = `${apiUrl}/api/register-user`;

export const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;