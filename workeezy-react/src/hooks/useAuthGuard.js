import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "./useAuth";

export default function useAuthGuard(options = {}) {
    const {
        requireLogin = false,
        requireProfileVerified = false,
        allowedRoles = null,
        redirectLogin = "/login",
        redirectProfile = "/profile-check",
    } = options;

    const navigate = useNavigate();
    const {isAuthenticated, user, loading} = useAuth();

    useEffect(() => {
        if (loading) return;

        // 로그인 필요
        if (requireLogin && !isAuthenticated) {
            navigate(redirectLogin, {replace: true});
            return;
        }

        // 프로필 검증 필요
        if (
            requireProfileVerified &&
            isAuthenticated &&
            !user?.profileVerified
        ) {
            navigate(redirectProfile, {replace: true});
            return;
        }

        // role 제한
        if (
            allowedRoles &&
            isAuthenticated &&
            user &&
            !allowedRoles.includes(user.role)
        ) {
            navigate("/403", {replace: true});
        }
    }, [
        requireLogin,
        requireProfileVerified,
        allowedRoles,
        isAuthenticated,
        user,
        loading,
        navigate,
        redirectLogin,
        redirectProfile,
    ]);
}