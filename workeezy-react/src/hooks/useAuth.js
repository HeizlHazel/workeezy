import {useEffect, useState} from "react";
import {loginApi, logoutApi, refreshApi} from "../api/authApi";
import {getMyInfoApi} from "../api/userApi";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = user !== null;

    // 앱 시작 시 인증 초기화
    useEffect(() => {
        async function initAuth() {
            const auto = localStorage.getItem("autoLogin");

            try {
                // autoLogin 여부와 무관하게 refresh 한 번 시도
                await refreshApi();          // refreshToken → accessToken 재발급

                const {data} = await getMyInfoApi(); // 내 정보 조회

                setUser({
                    name: data.username,
                    role: data.role,
                });
            } catch (e) {
                // refresh / me 실패 → 비로그인 처리
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        initAuth();
    }, []);

    // 로그인
    const login = async ({email, password, autoLogin}) => {
        const {data} = await loginApi(email, password, autoLogin);

        setUser({
            name: data.username,
            role: data.role,
        });

        if (autoLogin) {
            localStorage.setItem("autoLogin", "true");
        } else {
            localStorage.removeItem("autoLogin");
        }

        return data;
    };

    // 로그아웃
    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            localStorage.removeItem("autoLogin");
            setUser(null);
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