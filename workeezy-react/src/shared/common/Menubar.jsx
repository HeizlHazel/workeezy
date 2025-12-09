import "./Menubar.css";
import React, {useState, useEffect} from "react";
import {logoutApi} from "../../api/authApi.js"
import {alert, toast} from "../alert/workeezyAlert.js";

export default function MenuBar({isAdmin = false, onClose}) {
    const [userName, setUserName] = useState(null);

    const token = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("role");

    useEffect(() => {
        const name = localStorage.getItem("userName");
        setUserName(name);
    }, []);

    // 로그아웃
    const handleLogout = async () => {
        const result = await alert.fire({
            text: "로그아웃 하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#ccc",
            cancelButtonColor: "#35593D",
            confirmButtonText: "로그아웃",
            cancelButtonText: "취소",
            timer: null,
        });


        if (!result.isConfirmed) return;

        await logoutApi();
        localStorage.clear();

        await toast.fire({
            icon: "success",
            title: "로그아웃 완료! 다시 만나요. 😥",
        });
        window.location.href = "/login";
    };

// 보호된 메뉴 클릭 처리
    const handleProtectedClick = async (path) => {
        if (!token) {
            await toast.fire({
                icon: "warning",
                title: "로그인이 필요한 서비스입니다.",
                text: "로그인 후 이용해주세요.",
                timer: 1500,
            });
            window.location.href = "/login";
            return;
        }
        window.location.href = path;
    };

// 메뉴 데이터
    const userMenu = [
        {
            title: "마이페이지",
            sub: [
                {name: "개인 정보 조회", path: "/profile-check"},
                {name: "찜 목록", path: "/likes"},
            ],
        },
        {
            title: "나의 예약",
            sub: [
                {name: "예약 조회", path: "/reservation/list"},
                {name: "예약 변경", path: "/modifyreservation"},
            ],
        },
        {title: "프로그램 찾기", path: "/search"},
        {title: "리뷰", path: "/reviews"},
    ];

    const adminMenu = [
        {
            title: "예약 관리",
            sub: [
                {name: "예약 조회", path: "/admin/reservations"},
                {name: "예약 승인", path: "/admin/approval"},
            ],
        },
        {title: "프로그램 찾기", path: "/search"},
        {title: "리뷰", path: "/reviews"},
        {title: "Admin", isFooter: true, path: "/admin"},
    ];

    const isAdminUser =
        isAdmin ||
        userRole === "ADMIN" ||
        userRole === "ROLE_ADMIN" ||
        userRole?.toUpperCase()?.includes("ADMIN");

    const menu = isAdminUser ? adminMenu : userMenu;

// 서브메뉴 자동으로 모두 open
    const [openItems, setOpenItems] = useState([]);
    useEffect(() => {
        const allTitles = menu.filter((m) => m.sub).map((m) => m.title);
        setOpenItems(allTitles);
    }, []);

    const toggleItem = (title) => {
        setOpenItems((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const goToLogin = () => {
        window.location.href = "/login";
    };

    return (
        <div className="menu-bar">

            {/* 메뉴 헤더 */}
            <div className="menu-header">
                {token && (
                    <p className="menu-user">
                        {userName}님 👋
                        {isAdminUser && (
                            <span className="admin-badge">Admin</span>
                        )}
                    </p>
                )}
            </div>

            <hr className="menu-divider"/>

            {/* 메뉴 반복 렌더링 */}
            {menu.map((item, idx) => (
                <div key={idx} className="menu-item">

                    <div
                        className={`menu-title ${item.isFooter ? "menu-footer" : ""}`}
                        onClick={() =>
                            item.path
                                ? handleProtectedClick(item.path)
                                : toggleItem(item.title)
                        }
                    >
                        {item.title}
                    </div>

                    {/* 서브메뉴 */}
                    {item.sub && openItems.includes(item.title) && (
                        <div className="submenu">
                            {item.sub.map((sub, subIdx) => (
                                <div
                                    key={subIdx}
                                    className="submenu-item"
                                    onClick={() => handleProtectedClick(sub.path)}
                                >
                                    {sub.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* 로그인 / 로그아웃 버튼 */}
            <div className="logout-btn">
                {token ? (
                    <div className="logout-title" onClick={handleLogout}>
                        로그아웃
                    </div>
                ) : (
                    <div className="logout-title" onClick={goToLogin}>
                        로그인
                    </div>
                )}
            </div>
        </div>
    );
}
