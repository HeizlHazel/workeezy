import ErrorLayout from "./ErrorLayout";
import {useNavigate} from "react-router-dom";

export default function NotFound() {
    const nav = useNavigate();

    return (
        <ErrorLayout
            code="404"
            title="페이지를 찾을 수 없습니다"
            message="요청한 페이지가 존재하지 않거나 이동되었어요."
        >
            <button className="error-btn" onClick={() => nav("/")}>
                홈으로 이동
            </button>
        </ErrorLayout>
    );
}