
export const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

export const profile = (token: string) => fetch(`${API_URL}/profile`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const user = (username: string) => fetch(`${API_URL}/user/${username}`);