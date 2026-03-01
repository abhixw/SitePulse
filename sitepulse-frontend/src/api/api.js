import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const analyzeWebsite = async (data) => {
    const response = await api.post("/audit", data);
    return response.data;
};
