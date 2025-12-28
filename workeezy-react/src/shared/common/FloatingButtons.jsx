import "./FloatingButtons.css";
import { FaChevronUp, FaRegCommentAlt } from "react-icons/fa";

const openKakaoChat = () => {
    window.open("https://pf.kakao.com/_TShYn/chat", "_blank");
};

// ✅ rAF 기반 부드러운 스크롤(어떤 컨테이너에서도 자연스럽게)
function smoothScrollToTop() {
    const el = document.scrollingElement || document.documentElement;
    const start = el.scrollTop;
    const duration = 500; // ms

    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        el.scrollTop = Math.round(start * (1 - easeOutCubic(p)));
        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

export default function FloatingButtons() {
    return (
        <div className="floating-btns">
            <button className="scroll-top" onClick={smoothScrollToTop} type="button">
                <FaChevronUp size={22} />
            </button>

            <button className="chat" onClick={openKakaoChat} type="button">
                <div className="chatButton">
                    <FaRegCommentAlt size={22} color="#FFFFFF" />
                </div>
            </button>
        </div>
    );
}
