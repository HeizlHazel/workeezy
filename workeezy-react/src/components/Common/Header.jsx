import "./Header.css";

export default function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <img src="/logo.png" className="header-logo" />

                <div className="header-right">
                    <i className="fa-regular fa-user"></i>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </div>
        </header>
    );
}
