import "./LoginForm.css";
import LoginInputs from "../Login/LoginInputs";
import LoginOptions from "../Login/LoginOptions";
import LoginButton from "./LoginButton";
import SocialLoginButtons from "../Login/SocialLoginButtons";

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지
    const formData = new FormData(e.target);
    const id = formData.get("userId");
    const password = formData.get("password");
    console.log("로그인 시도:", { id, password });
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
