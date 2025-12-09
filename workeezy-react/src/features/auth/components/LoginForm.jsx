import "./LoginForm.css";
import LoginInputs from "./LoginInputs.jsx";
import LoginOptions from "./LoginOptions.jsx";
import LoginButton from "./LoginButton.jsx";
import SocialLoginButtons from "./SocialLoginButtons.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {loginApi} from "../../../api/authApi.js";
import {toast} from "../../../shared/alert/workeezyAlert.js";

export default function LoginForm() {
    const navigate = useNavigate();

    // 상태 정의
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberEmail, setRememberEmail] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);

    // 저장된 이메일 불러오기
    useEffect(() => {
        const saved = localStorage.getItem("savedEmail");
        if (saved) {
            setEmail(saved);
            setRememberEmail(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const {data} = await loginApi(email, password, autoLogin);

            console.log("로그인 성공", data);

            // 아이디 저장 여부 처리
            if (rememberEmail) {
                localStorage.setItem("savedEmail", email);
            } else {
                localStorage.removeItem("savedEmail");
            }

            // 자동 로그인 여부 저장
            if (autoLogin) {
                localStorage.setItem("autoLogin", "true");
            } else {
                localStorage.removeItem("autoLogin");
            }

            // 로그인 정보 저장
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("userName", data.username);
            localStorage.setItem("role", data.role);

            // SweetAlert 성공 팝업
            await toast.fire({
                icon: "success",
                title: `${data.username}님 환영합니다. 😊`,
            });
            navigate("/");

        } catch (err) {
            console.error("로그인 실패:", err);

            // SweetAlert 실패 팝업
            await toast.fire({
                icon: "error",
                title: "아이디 또는 비밀번호가 올바르지 않습니다.",
            });
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">로그인</h2>
            {/* 입력값 상태 전달 */}
            <LoginInputs
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}/>
            {/* 옵션 상태 전달 */}
            <LoginOptions
                rememberEmail={rememberEmail}
                setRememberEmail={setRememberEmail}
                autoLogin={autoLogin}
                setAutoLogin={setAutoLogin}/>
            <LoginButton/>
            <SocialLoginButtons/>
        </form>
    );
}
