import "./ProgramTabs.css";

export default function ProgramTabs() {

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        const headerHeight = 80;     // 기존 헤더 높이
        const extraOffset = 40;      // margin/padding 보정값 (직접 조절 가능!)

        if (section) {
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - (headerHeight + extraOffset);

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };



    return (
        <div className="pd-tabs">
            <button onClick={() => scrollToSection("program-info")}>프로그램 정보</button>
            <button onClick={() => scrollToSection("hotel-info")}>숙소 정보</button>
            <button onClick={() => scrollToSection("office-info")}>오피스</button>
            <button onClick={() => scrollToSection("activity-info")}>액티비티</button>
            <button onClick={() => scrollToSection("review-input")}>후기작성</button>
        </div>
    );
}
