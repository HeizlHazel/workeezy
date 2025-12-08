import api from "./axios.js";

// 로그인 API
export const loginApi = async (email, password, autoLogin) => {
    return api.post("/api/auth/login", {email, password, autoLogin});
};

// 로그아웃 API1
export const logoutApi = async () => {
    return api.post("/api/auth/logout");
};

// 비밀번호 확인 API

// 유저 정보 조회

// AccessToken 재발급 요청 — 외부에서 직접 쓰고 싶을 때
