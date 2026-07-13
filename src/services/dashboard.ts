import { getServerApi } from "@/services/server-api";

export async function getDashboardStatistics() {
    const api = await getServerApi();

    const response = await api.get("/users/me/statistics");

    return response.data.data;
}

export async function getProfile() {
    const api = await getServerApi();

    const response = await api.get("/users/me");

    return response.data.data;
}