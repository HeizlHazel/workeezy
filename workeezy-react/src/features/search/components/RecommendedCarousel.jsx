import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RecommendedCard from "./RecommendedCard";
import "./RecommendecCarousel.css";
import { useSearch } from "../context/SearchContext.jsx";

export default function RecommendedCarousel() {
    const { recommended } = useSearch();

    const listRef = useRef(null);
    const autoPlayRef = useRef(null);
    const navigate = useNavigate();

    const scroll = (direction) => {
        const container = listRef.current;
        if (!container) return;

        const card = container.querySelector(".recommend-card");
        if (!card) return;

        const cardWidth = card.offsetWidth + 24;
        const delta = direction === "left" ? -cardWidth : cardWidth;

        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const current = container.scrollLeft;
        const next = current + delta;

        if (direction === "right") {
            if (next >= maxScrollLeft - 5) {
                container.scrollTo({ left: 0, behavior: "auto" });
            } else {
                container.scrollBy({ left: delta, behavior: "smooth" });
            }
        } else {
            if (next <= 0) {
                container.scrollTo({ left: maxScrollLeft, behavior: "auto" });
            } else {
                container.scrollBy({ left: delta, behavior: "smooth" });
            }
        }
    };

    useEffect(() => {
        if (recommended.length === 0) return;
        autoPlayRef.current = setInterval(() => scroll("right"), 3000);
        return () => autoPlayRef.current && clearInterval(autoPlayRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recommended]);

    if (recommended.length === 0) return null;

    return (
        <section className="recommend-section">
            <h2 className="recommend-section-title">다른 지역은 어떠세요?</h2>

            <div className="recommend-carousel">
                <button className="recommend-arrow recommend-arrow-left" onClick={() => scroll("left")}>
                    ‹
                </button>

                <div className="recommend-list" ref={listRef}>
                    {recommended.map((p) => (
                        <RecommendedCard
                            key={p.id}
                            id={p.id}
                            title={p.title}
                            photo={p.photo}
                            price={p.price}
                            region={p.region}
                            onClick={() => navigate(`/programs/${p.id}`)}
                        />
                    ))}
                </div>

                <button className="recommend-arrow recommend-arrow-right" onClick={() => scroll("right")}>
                    ›
                </button>
            </div>
        </section>
    );
}
