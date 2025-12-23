import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProfileGuard({children}) {
    const navigate = useNavigate();
    const {user, isAuthenticated, loading} = useAuth();

    useEffect(() => {
        if (loading) return;

        // 미로그인 상태면 로그인 페이지
        if (!isAuthenticated) {
            navigate("/login", {replace: true});
            return;
        }

        // 프로필 미검증이면 프로필 확인 페이지
        if (!user?.profileVerified) {
            navigate("/profile-check", {replace: true});
        }
    }, [loading, isAuthenticated, user, navigate]);

    if (loading) return null;

    return children;
}