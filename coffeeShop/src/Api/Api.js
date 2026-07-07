import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5003/api",
    withCredentials:true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Full URL:", config.baseURL + config.url);
    console.log("Token:", config.headers.Authorization);
    console.log("Data:", config.data);

    return config;
});

export default API;