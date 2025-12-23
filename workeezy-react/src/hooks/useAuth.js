import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginApi, logoutApi} from "../api/authApi";
import {getMyInfoApi} from "../api/userApi.js";

export default function useAuth() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // 앱 시작 시 인증 상태 확인
    useEffect(() => {
        async function checkAuth() {
            try {
                const {data} = await getMyInfoApi(); // 쿠키 기반
                setUser({
                    name: data.username,
                    role: data.role,
                });
                setIsAuthenticated(true);
            } catch (e) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    // 로그인
    const login = async ({email, password, autoLogin, rememberEmail}) => {
        const {data} = await loginApi(email, password, autoLogin);

        // 토큰 저장 없음
        // 쿠키는 서버가 이미 내려줌

        setUser({
            name: data.username,
            role: data.role,
        });
        setIsAuthenticated(true);

        return data;
    };

    // 로그아웃
    const logout = async () => {
        try {
            await logoutApi(); // refreshToken 폐기
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            navigate("/login");
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };
}