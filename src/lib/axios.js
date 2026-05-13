import axios from 'axios';
import { clearAuth, getToken } from './authStorage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = getToken();
    config.headers = config.headers || {};

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const token = getToken();
        const isLoginRequest = originalRequest?.url?.includes('/login');

        if (status === 401 && !isLoginRequest) {
            clearAuth();
            window.dispatchEvent(new Event('auth:unauthorized'));
        }

        return Promise.reject(error);
    }
);

export default api;
