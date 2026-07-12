import axios from "axios";
import type { AxiosInstance } from "axios";
import { AUTH_COOKIE } from '@/lib/auth';

function getAuthTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookieValue = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${AUTH_COOKIE}=`))
        ?.split('=')[1];

    return cookieValue ? decodeURIComponent(cookieValue) : null;
}

export const api: AxiosInstance = axios.create({
    baseURL: "https://learnaiapi.algorixinsights.com",
    timeout: 5000,
});

api.interceptors.request.use(
    (config) => {
        const token = getAuthTokenFromCookie();
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);