import "./LoginForm.css";
import LoginInputs from "../Login/LoginInputs";
import LoginOptions from "../Login/LoginOptions";
import LoginButton from "./LoginButton";
import SocialLoginButtons from "../Login/SocialLoginButtons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("로그인 시도:", { email, password });

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      console.log("로그인 성공:", res.data.token);

      localStorage.setItem("accessToken", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인 실패");
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
