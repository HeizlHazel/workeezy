import axios from "axios";

// 기본 API axios - 인증 정보는 HttpOnly Cookie로만 전달
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// refresh 전용 axios - 쿠키만 사용
const refreshAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


// 응답 인터셉터 -401 → refresh 시도
// refresh 성공 시 기존 요청 그대로 재시도
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                await refreshAxios.post("/api/auth/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                // refresh 실패 → 인증 만료
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;