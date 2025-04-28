import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import Cookies from 'js-cookie';

const axiosSecure = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const refreshTokenHandler = auth?.refreshTokenHandler;
    const schedule = auth?.scheduleTokenRefreshLoop;

    useEffect(()=> {
        axiosSecure.interceptors.request.use(config => {
            const token = Cookies.get('uscTDLT');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        });

        axiosSecure.interceptors.response.use(response => response, async error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                await refreshTokenHandler?.().then(success => {
                    if (success) {
                        schedule?.();
                        // Retry the original request with the new token
                        return axiosSecure(error.config);
                    }
                }).catch(err => {
                    console.error("AxiosError in refreshing token: ", err)});
            }
            return Promise.reject(error);
        })
    }, [navigate, refreshTokenHandler, schedule]);

    return [axiosSecure];
}

export default useAxiosSecure;