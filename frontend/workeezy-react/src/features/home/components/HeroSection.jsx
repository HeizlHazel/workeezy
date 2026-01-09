import MainSearchBar from "./MainSearchBar.jsx";
import "./HeroSection.css";

export default function HeroSection() {
    return (
        <section className="section hero">
            <div className="hero-content">
                <h1 className="hero-title">Workeezy와 함께 워케이션 찾기</h1>
                <p className="hero-subtitle">여행과 업무를 동시에, 새로운 경험을 시작하세요.</p>
            </div>
            <MainSearchBar/>
        </section>
    );
}
