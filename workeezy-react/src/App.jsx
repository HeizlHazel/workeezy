import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./shared/route/PrivateRoute";
import ProfileGuard from "./shared/route/ProfileGuard";

import LoginPage from "./features/auth/pages/LoginPage.jsx";
import Home from "./features/home/pages/Home";
import MyPage from "./features/profile/pages/MyPage.jsx";
import ProfilePasswordCheck from "./features/profile/pages/ProfilePasswordCheck.jsx";

import ProgramDetailPage from "./features/program/pages/ProgramDetailPage.jsx";
import ReviewPage from "./features/review/pages/ReviewPage.jsx";
import SearchPage from "./features/search/pages/SearchPage.jsx";
import NewReservationPage from "./features/reservation/pages/NewReservationPage.jsx";
import ModifyReservationPage from "./features/reservation/pages/ModifyReservationPage.jsx";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>

            {/* 비밀번호 재확인 단계 */}
            <Route
                path="/profile-check"
                element={
                    <PrivateRoute>
                        <ProfilePasswordCheck />
                    </PrivateRoute>
                }
            />

            {/* 마이페이지 */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfileGuard>
                            <MyPage />
                        </ProfileGuard>
                    </PrivateRoute>
                }
            />

            {/* 기타 페이지 */}
            <Route path="/program" element={<ProgramDetailPage/>}/>
            <Route path="/reviews" element={<ReviewPage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/newreservation" element={<NewReservationPage/>}/>
            <Route path="/modifyreservation" element={<ModifyReservationPage/>}/>
        </Routes>
    );
}
