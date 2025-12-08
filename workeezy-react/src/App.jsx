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
import LikesPage from "./features/profile/pages/LikesPage.jsx";
import Forbidden from "./shared/error/Forbidden.jsx";
import ServerError from "./shared/error/ServerError.jsx";
import NotFound from "./shared/error/NotFound.jsx";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            {/* 비밀번호 재확인 */}
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
            <Route path="/likes" element={<LikesPage/>}/>


            {/* 검색, 리뷰 */}
            <Route path="/program" element={<ProgramDetailPage/>}/>
            <Route path="/programs/:id" element={<ProgramDetailPage/>}/>

            <Route path="/reviews" element={<ReviewPage/>}/>
            <Route path="/search" element={<SearchPage/>}/>

            {/* 예약 */}
            <Route path="/newreservation" element={<NewReservationPage/>}/>
            <Route path="/modifyreservation" element={<ModifyReservationPage/>}/>

            {/* 에러 페이지 */}
            <Route path="/403" element={<Forbidden />} />
            <Route path="/500" element={<ServerError />} />

            {/* 404 자동 이동 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
