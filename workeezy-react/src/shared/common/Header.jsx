import {Link} from "react-router-dom";
import "./Header.css";

export default function Header({onOpenMenu}) {
    const token = localStorage.getItem("accessToken");

    // 링크 경로 설정
    const userLink = token ? "/profile-check" : "/login";

    // 아이콘 클래스 설정
    const userIconClass = token
        ? "fa-solid fa-user user-icon"   // 로그인 상태
        : "fa-regular fa-user user-icon"; // 로그아웃 상태

    return (
        <header className="header">
            <div className="header-inner">

                <Link to="/">
                    <img src="/workeezy_logo.png" className="header-logo"/>
                </Link>

                <div className="header-right">
                    <Link to={userLink}>
                        <i className={userIconClass}></i>
                    </Link>

                    <i className="fa-solid fa-bars menu-icon" onClick={onOpenMenu}></i>
                </div>
            </div>
        </header>
    );
}
