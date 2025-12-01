import "./PageLayout.css";
import Header from "../components/Header/Header";

export default function PageLayout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
    </div>
  );
}
