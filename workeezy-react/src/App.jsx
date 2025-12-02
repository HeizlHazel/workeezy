import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import ReviewPage from "./pages/ReviewPage";
import SearchPage from "./pages/SearchPage";
import NewReservationForm from "./pages/NewReservationForm";
import ModifyReservationPage from "./pages/ModifyReservationPage.jsx";
import Menubar from "./components/Menubar/Menubar";
import DraftMenuBar from "./components/DraftMenuBar/DraftMenuBar";

export default function App() {
  return (
    <Routes>
      {/* 기본 URL → 로그인 페이지로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/program" element={<ProgramDetailPage />} />
      <Route path="/reviews" element={<ReviewPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/newreservation" element={<NewReservationForm />} />
      <Route path="/modifyreservation" element={<ModifyReservationPage />} />
      {/* <Route path="/menubar" element={<Menubar />} /> */}
      {/* <Route path="/menubar" element={<Menubar isAdmin={true} />} /> */}
      <Route path="/draftmenubar" element={<DraftMenuBar />} />
    </Routes>
  );
}
