import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// refresh 요청 전용 axios
const refreshAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// 응답 인터셉터 → AccessToken 만료 시 자동 재발급 처리
api.interceptors.response.use(
    (res) => res,

    async (err) => {
        const originalRequest = err.config;
        const status = err.response?.status;

        // accessToken 만료 → refresh 시도
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // refreshToken은 쿠키로 자동 전송됨
                await refreshAxios.post("/api/auth/refresh");

                // 새 accessToken은 서버가 쿠키로 내려줌
                // 프론트는 아무 것도 저장/세팅 안 함

                return api(originalRequest); // 실패한 요청 재시도
            } catch (e) {
                console.error("🔥 refresh 실패 → 로그아웃 처리");

                // 필요 시 프론트 상태만 정리
                localStorage.removeItem("profileVerified");

                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default api;