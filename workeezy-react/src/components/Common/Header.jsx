import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ onOpenMenu }) {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/">
          <img src="/logo.png" className="header-logo" />
        </Link>

        <div className="header-right">
          <Link to="/login">
            <i className="fa-regular fa-user user-icon"></i>
          </Link>
          <i className="fa-solid fa-bars menu-icon" onClick={onOpenMenu}></i>
        </div>
      </div>
    </header>
  );
}
