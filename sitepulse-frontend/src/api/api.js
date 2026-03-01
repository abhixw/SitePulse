import axios from "axios";

const api = axios.create({
    // If running logically on localhost, use local. Otherwise, use Render Production URL
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://sitepulse-vdqe.onrender.com",
});

export const analyzeWebsite = async (data) => {
    const response = await api.post("/audit", data);
    return response.data;
};
