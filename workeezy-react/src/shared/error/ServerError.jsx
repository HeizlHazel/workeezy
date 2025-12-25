import ErrorLayout from "./ErrorLayout";
import {useNavigate} from "react-router-dom";

export default function ServerError() {
    const nav = useNavigate();

    return (
        <ErrorLayout
            code="500"
            title="서버 오류 발생"
            message="잠시 후 다시 시도해주세요."
        >
            <button className="error-btn" onClick={() => nav("/")}>
                홈으로 이동
            </button>
        </ErrorLayout>
    );
}