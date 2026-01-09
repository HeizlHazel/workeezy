import ErrorLayout from "./ErrorLayout";
import {useNavigate} from "react-router-dom";

export default function Forbidden() {
    const nav = useNavigate();

    return (
        <ErrorLayout
            code="403"
            title="접근 권한이 없습니다"
            message="로그인이 필요하거나 접근할 수 없는 페이지입니다."
        >
            <button className="error-btn" onClick={() => nav("/login")}>
                로그인하기
            </button>
        </ErrorLayout>
    );
}