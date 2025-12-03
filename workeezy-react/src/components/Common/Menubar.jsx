import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "./MenuBar.css";

export default function MenuBar({isAdmin = false, onClose}) {

    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const name = localStorage.getItem("userName");
        setUserName(name); // null이면 null로 저장 → 자동으로 아무것도 안 보임
    }, []);

    const [openItems, setOpenItems] = useState([]); // 펼침 관리

    const userMenu = [
        {
            title: "마이페이지",
            sub: [
                {name: "개인 정보 조회", path: "/profile"},
                {name: "찜 목록", path: "/mypage/likes"},
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
        {title: "프로그램 찾기", path: "/program"},
        {title: "리뷰", path: "/reviews"},
        {title: "Admin", isFooter: true, path: "/admin"},
    ];

    const menu = isAdmin ? adminMenu : userMenu;

    // 소메뉴 기본 open
    useEffect(() => {
        const allWithSub = menu.filter((m) => m.sub).map((m) => m.title);
        setOpenItems(allWithSub);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ✅ 의존성 배열 비워서 최초 1회만 실행

    const toggleItem = (title) => {
        setOpenItems(
            (prev) =>
                prev.includes(title)
                    ? prev.filter((t) => t !== title) // 이미 열려 있으면 닫기
                    : [...prev, title] // 닫혀 있으면 열기
        );
    };

    return (
        <div className="menu-bar">
            <div className="menu-header">
                <p className="menu-user">{userName}님 👋</p>
                <i className="fa-solid fa-xmark close-menu" onClick={onClose}></i>
            </div>
            <hr className="menu-divider"/>
            {menu.map((item, idx) => (
                <div key={idx} className="menu-item">
                    <div
                        className={`menu-title ${item.isFooter ? "menu-footer" : ""}`}
                        onClick={() => toggleItem(item.title)}
                    >
                        {item.path ? <Link to={item.path}>{item.title}</Link> : item.title}
                    </div>

                    {item.sub && openItems.includes(item.title) && (
                        <div className="submenu">
                            {item.sub.map((sub, subIdx) => (
                                <Link
                                    to={sub.path}
                                    key={subIdx}
                                    className="submenu-item"
                                    onClick={onClose}
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
