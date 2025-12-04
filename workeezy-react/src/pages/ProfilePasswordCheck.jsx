import PageLayout from "../layout/PageLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function ProfilePasswordCheck() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    console.log("로컬스토리지 토큰:", localStorage.getItem("accessToken"));


    const handleCheck = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/api/auth/check-password",
        {
          password,
        }
      );

      if (res.data.success) {
        // 🔥 인증 성공 저장
        localStorage.setItem("profileVerified", "true");

        // 🔥 마이페이지로 이동
        navigate("/profile", { replace: true });
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <div className="profile-check-wrapper">
      <form onSubmit={handleCheck} className="profile-check-form">
        <h2>비밀번호 확인</h2>

        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">확인</button>
      </form>
    </div>
  );
}
