import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

// 요청마다 accessToken 자동 포함
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("헤더 보내기:", config.headers.Authorization);
        console.log("🔐 Authorization 보내는 값:", config.headers.Authorization);
        return config;
    });

// refresh 요청 전용 axios
// Authorization 헤더 자동 포함 방지
const refreshAxios = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

refreshAxios.defaults.withCredentials = true;

// 응답 인터셉터 → AccessToken 만료 시 자동 재발급 처리
api.interceptors.response.use(
    (res) => res,

    async (err) => {
        const originalRequest = err.config;
        const status = err.response?.status;

        // accessToken 만료(401) → refresh 시도
        if ((status === 401 || status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshRes = await refreshAxios.post("/api/auth/refresh");
                const newAccessToken = refreshRes.data.token;

                localStorage.setItem("accessToken", newAccessToken);

                // axios 기본 헤더 갱신
                api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

                // originalRequest 헤더 보정
                if (!originalRequest.headers) {
                    originalRequest.headers = {};
                }
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest); // 실패한 요청 재시도
            } catch (e) {
                console.error("🔥 refresh 실패 → 자동 로그아웃");

                localStorage.removeItem("accessToken");
                window.location.href = "/login";

                return Promise.reject(e);
            }
        }

        // refresh 실패가 아닌 401 → 로그인 이동
        if (status === 401) {
            window.location.href = "/login";
        }

        // 접근 권한 없음(403) → 에러 페이지 이동
        // if (status === 403) {
        //     window.location.href = "/403";
        // }

        // 서버 문제(500) → 에러 페이지 이동
        if (status === 500) {
            window.location.href = "/500";
        }

        return Promise.reject(err);
    }
);
export default api;
