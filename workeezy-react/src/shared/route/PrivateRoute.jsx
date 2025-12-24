import {Navigate, Outlet} from "react-router-dom";
import {useAuthContext} from "../../auth/AuthContext.jsx";

export default function PrivateRoute({children}) {
    const {isAuthenticated, loading} = useAuthContext();

    // 인증 확인 중
    if (loading) {
        return null; // 또는 <LoadingSpinner />
    }

    // 미인증
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 인증됨
    return children ? children : <Outlet />;
}