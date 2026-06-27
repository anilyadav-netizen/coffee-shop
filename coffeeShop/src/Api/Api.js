// src/Api/Api.js

import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5003/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    API.interceptors.request.use((config) => {
  console.log("URL:", config.url);
  console.log("TOKEN:", config.headers.Authorization);
  console.log("DATA:", config.data);
  return config;
});

    return req;
});

export default API;