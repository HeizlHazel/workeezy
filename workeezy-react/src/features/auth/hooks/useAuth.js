import {useEffect, useState} from "react";
import {loginApi, logoutApi} from "../api/authApi.js";
import {getMyInfoApi} from "../api/userApi.js";
import {refreshAxios} from "../../../api/axios.js";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const isAuthenticated = user !== null;

    // 앱 시작 시 인증 초기화
    useEffect(() => {
        async function initAuth() {
            console.log("🟢 initAuth start");

            // 이미 로그인으로 user가 있으면 건너뜀
            if (initialized) {
                console.log("🟡 initAuth skip (initialized)");
                setLoading(false);
                return;
            }

            try {
                await refreshAxios.post("/api/auth/refresh");
                const res = await getMyInfoApi();
                console.log("🟢 me success", res.data);

                setUser({
                    name: res.data.name,
                    role: res.data.role,
                });
            } catch (e) {
                console.log("🔴 me fail", e?.response?.status);
            } finally {
                setInitialized(true);
                setLoading(false);
                console.log("🟡 initAuth end");
            }
        }

        initAuth();
    }, [initialized]);

    // 로그인
    const login = async ({email, password, autoLogin}) => {

        const {data} = await loginApi(email, password, autoLogin);

        setUser({
            name: data.name,
            role: data.role,
        });

        if (autoLogin) {
            localStorage.setItem("autoLogin", "true");
        } else {
            localStorage.removeItem("autoLogin");
        }
        setInitialized(true);
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