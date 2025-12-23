import {Navigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import useProfileVerified from "../../hooks/useProfileVerified.js";

export default function ProfileGuard({children}) {
    const {isAuthenticated} = useAuth();
    const {verified} = useProfileVerified();

    // 로그인 안 됨
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    // 비밀번호 재확인 안 됨
    if (!verified) {
        return <Navigate to="/profile-check" replace/>;
    }

    return children;
}