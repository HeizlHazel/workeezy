import useAuth from "../hooks/useAuth.js";
import {AuthContext} from "../context/AuthContext.jsx";
import {useEffect} from "react";

export default function AuthProvider({children}) {
    const auth = useAuth(); // 여기서 단 1번만 실행

    useEffect(() => {
        console.log("🟣 AuthProvider MOUNT");
        return () => console.log("⚫ AuthProvider UNMOUNT");
    }, []);

    useEffect(() => {
        console.log("🟣 AuthProvider user:", auth.user);
    }, [auth.user]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}