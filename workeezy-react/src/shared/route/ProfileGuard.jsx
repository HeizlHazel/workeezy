import {Navigate} from "react-router-dom";

export default function ProfileGuard({children}) {
    const token = localStorage.getItem("accessToken");
    const verified = localStorage.getItem("profileVerified") === "true";

    // 1) 로그인 안 되어 있음 → 로그인 페이지
    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    // 2) 로그인은 되어 있는데, 비밀번호 재확인 안함 → 프로필 체크 페이지
    if (!verified) {
        return <Navigate to="/profile-check" replace/>;
    }

    return children;
}
