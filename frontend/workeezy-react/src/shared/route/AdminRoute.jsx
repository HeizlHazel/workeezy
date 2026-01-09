import {useAuthContext} from "../../features/auth/context/AuthContext.jsx";
import {normalizeRole} from "../../utils/normalizeRole.js";

export default function AdminRoute({children}) {
    const {user, isAuthenticated, loading} = useAuthContext();
    const isAdmin = normalizeRole(user?.role) === "ADMIN";

    if (loading) return null;

    // 로그인 안 됐으면 로그인 페이지
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    // 관리자 아니면 403
    if (!isAdmin) {
        return <Navigate to="/403" replace/>;
    }

    return children;
}