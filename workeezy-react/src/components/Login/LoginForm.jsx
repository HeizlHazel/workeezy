import "./LoginForm.css";
import LoginInputs from "../Login/LoginInputs";
import LoginOptions from "../Login/LoginOptions";
import LoginButton from "./LoginButton";
import SocialLoginButtons from "../Login/SocialLoginButtons";
import {useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import {useState} from "react";

export default function LoginForm() {
    const navigate = useNavigate();
    const [toast, setToast] = useState({show: false, message: "", type: ""});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const {data} = await axios.post(
                "http://localhost:8080/api/auth/login",
                {email, password},
                {withCredentials: true}
            );

            console.log("로그인 성공", data);

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("userName", data.username);
            localStorage.setItem("role", data.role);

            // 토스트 띄우기 (성공)
            setToast({
                show: true,
                message: "로그인 되었습니다.",
                type: "success",
            });

            // 1.5초 후 이동
            setTimeout(() => navigate("/"), 1500);

        } catch (err) {
            console.error("로그인 실패:", err);

            // 토스트 띄우기 (실패)
            setToast({
                show: true,
                message: "아이디 또는 비밀번호가 올바르지 않습니다.",
                type: "error",
            });

            // 실패 알림 1.5초 뒤 자동 숨김
            setTimeout(() => {
                setToast({show: false, message: "", type: ""});
            }, 1500);
        }
    };

    return (
        <>
            <form className="login-form" onSubmit={handleSubmit}>
                <LoginInputs/>
                <LoginOptions/>
                <LoginButton/>
                <SocialLoginButtons/>
            </form>
            {toast.show && (
                <div className={`login-toast ${toast.type}`}>
                    <div className="login-toast-content">
            <span className="toast-icon">
                {toast.type === "success" ? "✔" : "⚠"}
            </span>
                        {toast.message}
                    </div>
                </div>
            )}
        </>
    );
}
