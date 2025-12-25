import axios from "axios";

const publicApi = axios.create({
    baseURL: "",
    withCredentials: true,
});

export default publicApi;