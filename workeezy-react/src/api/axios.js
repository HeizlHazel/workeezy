import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 요청 인터셉터 설정 → 모든 요청에 자동으로 JWT 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
