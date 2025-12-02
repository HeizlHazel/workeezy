import "./PageLayout.css";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";

export default function PageLayout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
