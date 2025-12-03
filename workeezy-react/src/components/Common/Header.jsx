import "./Header.css";

export default function Header({ onOpenMenu }) {
  return (
    <header className="header">
      <div className="header-inner">
        <img src="/logo.png" className="header-logo" />

        <div className="header-right">
          <i className="fa-regular fa-user"></i>
          <i className="fa-solid fa-bars"></i>
        </div>

        <button
          onClick={() => {
            console.log("메뉴 버튼 눌림");
            onOpenMenu();
          }}
        >
          ☰ 메뉴
        </button>
      </div>
    </header>
  );
}
