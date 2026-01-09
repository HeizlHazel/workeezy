import api from "../../../api/axios.js";

// 로그인 API
export const loginApi = async (email, password, autoLogin) => {
    return api.post(
        "/api/auth/login",
        {email, password, autoLogin},
        {
            withCredentials: true,
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
        });
};

// 로그아웃 API1
export const logoutApi = async () => {
    return api.post("/api/auth/logout");
};

// 비밀번호 확인 API
export const checkPasswordApi = (password) => {
    return api.post("/api/auth/check-password", {password});
}