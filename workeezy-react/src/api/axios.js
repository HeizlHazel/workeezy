import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // refreshToken 쿠키 사용하려면 필요
});

// 요청마다 accessToken 자동 포함
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

// 응답 인터셉터 → AccessToken 만료 시 자동 재발급 처리
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // 토큰 만료(401) AND 무한루프 방지 처리
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1) refreshToken으로 새 accessToken 요청
                const {data} = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {},
                    {withCredentials: true}
                );

                // 새 accessToken 저장
                localStorage.setItem("accessToken", data.token);

                // 재요청 시 Authorization 헤더 교체
                originalRequest.headers.Authorization = `Bearer ${data.token}`;

                return api(originalRequest);
            } catch (err2) {
                console.error("토큰 재발급 실패:", err2);
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }

            //   // 2) 새 accessToken 저장
            //   const newAccessToken = res.data.accessToken;
            //   localStorage.setItem("accessToken", newAccessToken);
            //
            //   // 3) 실패했던 요청에 새 accessToken 넣고 재시도
            //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            //   return api(originalRequest);
            // } catch (refreshErr) {
            //   console.error("토큰 재발급 실패:", refreshErr);
            //
            //   // 4) refresh 실패 시 → 자동 로그아웃
            //   localStorage.removeItem("accessToken");
            //   window.location.href = "/login";
            //
            //   return Promise.reject(refreshErr);
            // }
        }

        return Promise.reject(err);
    }
);

export default api;
