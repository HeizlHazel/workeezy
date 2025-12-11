import {Routes, Route} from "react-router-dom";
import {useEffect} from "react";
import api from "./api/axios.js";

import PrivateRoute from "./shared/route/PrivateRoute";
import ProfileGuard from "./shared/route/ProfileGuard";

import LoginPage from "./features/auth/pages/LoginPage.jsx";
import Home from "./features/home/pages/Home";
import MyPage from "./features/profile/pages/MyPage.jsx";
import LikesPage from "./features/profile/pages/LikesPage.jsx";
import ProfilePasswordCheck from "./features/profile/pages/ProfilePasswordCheck.jsx";

import ProgramDetailPage from "./features/program/pages/ProgramDetailPage.jsx";
import ReviewPage from "./features/review/pages/ReviewPage.jsx";
import SearchPage from "./features/search/pages/SearchPage.jsx";

import NewReservationPage from "./features/reservation/pages/NewReservationPage.jsx";
import ModifyReservationPage from "./features/reservation/pages/ModifyReservationPage.jsx";
import AdminReservationListPage from "./features/reservation/pages/AdminReservationListPage.jsx";

import Forbidden from "./shared/error/Forbidden.jsx";
import ServerError from "./shared/error/ServerError.jsx";
import NotFound from "./shared/error/NotFound.jsx";

import PaymentSuccessPage from "./features/payment/pages/PaymentSuccessPage.jsx";
import PaymentFailPage from "./features/payment/pages/PaymentFailPage.jsx";

export default function App() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("b915b18542b9776646e5434c83e959c9");
        console.log("Kakao SDK initialized!");
    }

    useEffect(() => {
        const auto = localStorage.getItem("autoLogin  ");

        // 자동 로그인 미체크 시 패스
        if (auto !== "true") return;

        // accessToken이 이미 있으면 패스
        if (localStorage.getItem("accessToken")) return;

        // 자동 로그인 체크시에만 refresh 시도
        api.post("/api/auth/refresh")
            .then(res => {
                const newToken = res.data.token;
                localStorage.setItem("accessToken", newToken);
                console.log("자동 로그인 성공(refresh 재발급 완료)");
            })
            .catch(err => {
                console.log("자동 로그인 실패: ", err);
                localStorage.removeItem("autoLogin");
                // 실패 시 로그인 페이지로 리다이렉트 또는 무시
            });
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            {/* 비밀번호 재확인 */}
            <Route
                path="/profile-check"
                element={
                    <PrivateRoute>
                        <ProfilePasswordCheck/>
                    </PrivateRoute>
                }
            />
            {/* 마이페이지 */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfileGuard>
                            <MyPage/>
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
            <Route
                path="/admin/reservationlist"
                element={<AdminReservationListPage/>}
            />

            {/* 결제 */}
            <Route path="/payment" element={<PaymentSuccessPage/>}/>
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/fail" element={<PaymentFailPage />} />


            {/* 에러 페이지 */}
            <Route path="/403" element={<Forbidden/>}/>
            <Route path="/500" element={<ServerError/>}/>
            {/* 404 자동 이동 */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}
