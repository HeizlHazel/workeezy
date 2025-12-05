import axios from "axios";

// 전역 설정
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: "http://localhost:8080/",
    withCredentials: true,
});

// 인스턴스 설정 (추가 안전)
api.defaults.withCredentials = true;

// 요청마다 accessToken 자동 포함
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

// refresh 요청 전용 axios
// Authorization 헤더 자동 포함 방지
const refreshAxios = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

// 응답 인터셉터 → AccessToken 만료 시 자동 재발급 처리
api.interceptors.response.use(
    (res) => res,

    async (err) => {
        const originalRequest = err.config;

        // 토큰 만료(401) + 무한루프 방지 처리
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshRes = await refreshAxios.post("/api/auth/refresh");

                // 백엔드 응답: { token: "새토큰", username: "hong@.." }
                const newAccessToken = refreshRes.data.token;

                // 새 accessToken 저장
                localStorage.setItem("accessToken", newAccessToken);

                // 재요청 시 Authorization 헤더 교체
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 실패한 요청 재전송
                return api(originalRequest);

            } catch (e) {
                console.error("🔥 토큰 재발급 실패 → 자동 로그아웃");

                localStorage.removeItem("accessToken");
                window.location.href = "/login";

                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default api;
