import axios from "axios";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";

export async function getServerApi() {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    return axios.create({
        baseURL: "https://learnaiapi.algorixinsights.com/api/v1",
        timeout: 5000,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}