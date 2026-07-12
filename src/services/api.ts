import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: "https://learnaiapi.algorixinsights.com",
    timeout: 5000,
});