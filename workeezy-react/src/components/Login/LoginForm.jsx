import "./LoginForm.css";
import LoginInputs from "../Login/LoginInputs";
import LoginOptions from "../Login/LoginOptions";
import LoginButton from "./LoginButton";
import SocialLoginButtons from "../Login/SocialLoginButtons";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("로그인 시도:", { email, password });

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true } // refreshToken 쿠키 받기 위해 필수
      );
      console.log("로그인 성공");
      localStorage.setItem("accessToken", data.token);
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <LoginInputs />
      <LoginOptions />
      <LoginButton />
      <SocialLoginButtons />
    </form>
  );
}
