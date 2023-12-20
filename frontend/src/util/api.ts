import { Group } from "./group";

export const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

export const profile = (token: string) => fetch(`${API_URL}/profile`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const user = (username: string) => fetch(`${API_URL}/user/${username}`);

export const groups = () => fetch(`${API_URL}/groups`);

export const createGroup = (token: string, group: Omit<Group, "id">) => fetch(`${API_URL}/groups`, {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(group),
});