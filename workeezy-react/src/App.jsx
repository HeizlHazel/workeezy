import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import ReviewPage from "./pages/ReviewPage";
import SearchPage from "./pages/SearchPage";
import NewReservationPage from "./pages/NewReservationPage.jsx";
import ModifyReservationPage from "./pages/ModifyReservationPage.jsx";
import MyPage from "./pages/MyPage.jsx";
import Home from "./pages/Home.jsx";
import ProfilePasswordCheck from "./pages/ProfilePasswordCheck.jsx";
import ProfileGuard from "./components/Auth/ProfileGuard.jsx";

export default function App() {
  return (
    <Routes>
      {/* 기본 URL → 로그인 페이지로 리다이렉트 */}
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/profile"
        element={
          <ProfileGuard>
            <MyPage />
          </ProfileGuard>
        }
      />
      <Route path="/profilecheck" element={<ProfilePasswordCheck />} />

      <Route path="/program" element={<ProgramDetailPage />} />
      <Route path="/reviews" element={<ReviewPage />} />
      <Route path="/search" element={<SearchPage />} />

      <Route path="/newreservation" element={<NewReservationPage />} />
      <Route path="/modifyreservation" element={<ModifyReservationPage />} />
    </Routes>
  );
}
