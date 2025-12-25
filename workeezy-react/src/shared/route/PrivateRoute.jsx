import {Navigate, Outlet} from "react-router-dom";
import {useAuthContext} from "../../features/auth/context/AuthContext.jsx";

export default function PrivateRoute({children}) {
    const {isAuthenticated, loading} = useAuthContext();

    // 인증 확인 중
    if (loading) {
        return null;
    }

    // 미인증
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    // 인증됨
    return children ? children : <Outlet/>;
}