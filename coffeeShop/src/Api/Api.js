import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5003/api",
    baseURl: '/api',
    withCredentials: true,
});



export default API;