import axios from "axios";

const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // refreshToken 쿠키 때문에 필요할 수 있음
});

// Authorization 자동 추가 제거 (전혀 안 붙임)
publicApi.interceptors.request.use((config) => {
    return config;
});

// Refresh 로직도 제거 (public API는 필요 없음)
publicApi.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err)
);

export default publicApi;
