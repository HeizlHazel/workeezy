import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginApi, logoutApi} from "../api/authApi";

export default function useAuth() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const isAuthenticated = !!localStorage.getItem("accessToken");

    useEffect(() => {
        if (!isAuthenticated) return;

        const name = localStorage.getItem("userName");
        const role = localStorage.getItem("role");

        if (name && role) {
            setUser({name, role});
        }
    }, [isAuthenticated]);

    // 로그인
    const login = async ({email, password, autoLogin, rememberEmail}) => {
        const {data} = await loginApi(email, password, autoLogin);

        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("userName", data.username);
        localStorage.setItem("role", data.role);

        setUser({
            name: data.username,
            role: data.role,
        });

        return data;
    };

    // 로그아웃
    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            localStorage.clear();
            setUser(null);
            navigate("/login");
        }
    };

    return {
        user,
        isAuthenticated,
        login,
        logout,
    };
}