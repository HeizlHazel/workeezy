import "./PageLayout.css";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { useState } from "react";
import MenuBar from "../components/Common/Menubar";

export default function PageLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout">
      {/* Header에 setOpen 넘겨주기 */}
      <Header onOpenMenu={() => setOpen(true)} />

      {/* 오버레이 + 메뉴바 */}
      {open && (
        <>
          {/* 오버레이 (배경 클릭 시 닫힘!) */}
          <div className="menu-overlay" onClick={() => setOpen(false)} />

          <MenuBar onClose={() => setOpen(false)} />
        </>
      )}

      <main className="content">{children}</main>

      <Footer />
    </div>
  );
}
