import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import ReviewPage from "./pages/ReviewPage";
import SearchResultPage from "./pages/SearchPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
    return (
            <Routes>
                {/* 기본 URL → 로그인 페이지로 리다이렉트 */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/program" element={<ProgramDetailPage />} />
                <Route path="/reviews" element={<ReviewPage />} />
                <Route path="/search" element={<SearchPage/>} />
            </Routes>
    );
}
