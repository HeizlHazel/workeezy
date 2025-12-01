import ReviewPage from "./pages/ReviewPage";
import SearchPage from "./pages/SearchPage.jsx";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import LoginPage from "./pages/LoginPage.jsx";
import { useEffect } from "react";
import axios from "axios";

export default function App() {
  useEffect(() => {
    axios
      .post("/api/auth/login", {
        email: "hong@company.com",
        password: "900515",
      })
      .then((res) => {
        console.log("로그인 성공:", res.data);
      })
      .catch((err) => {
        console.error("로그인 실패", err);
      });
  }, []);

  return (
    <div>
      로그인 테스트 중...
      <LoginPage />
    </div>
  );
}
