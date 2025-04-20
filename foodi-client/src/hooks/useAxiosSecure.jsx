import axios from "axios";
import {useNavigate} from "react-router-dom"
import useAuth from "./useAuth";
import { useEffect } from "react";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const {logOut} = useAuth();

    useEffect(() => {
        // Request Interceptor
        const requestIntercept = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access-token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response Interceptor
        const responseIntercept = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 403) {
                        await logOut();
                        navigate("/login");
                    }
                    return Promise.reject(error.response.data);
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors
        return () => {
            axiosSecure.interceptors.request.eject(requestIntercept);
            axiosSecure.interceptors.response.eject(responseIntercept);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;