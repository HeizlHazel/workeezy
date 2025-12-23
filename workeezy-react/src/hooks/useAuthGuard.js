import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "./useAuth";

export default function useAuthGuard(options = {}) {
    const {
        requireLogin = false,
        requireProfileVerified = false,
        allowedRoles = null, // ["ADMIN"]
        redirectLogin = "/login",
        redirectProfile = "/profile-check",
    } = options;

    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();

    useEffect(() => {
        const profileVerified =
            localStorage.getItem("profileVerified") === "true";

        // 로그인 필요
        if (requireLogin && !isAuthenticated) {
            navigate(redirectLogin, {replace: true});
            return;
        }

        // 프로필 재확인 필요
        if (requireProfileVerified && !profileVerified) {
            navigate(redirectProfile, {replace: true});
            return;
        }

        // role 제한
        if (
            allowedRoles &&
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
        navigate,
        redirectLogin,
        redirectProfile,
    ]);
}