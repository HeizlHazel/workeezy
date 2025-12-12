// RecommendedCarousel.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendedCard from "./RecommendedCard";

import "./RecommendecCarousel.css";
import api from "../../../api/axios.js";

export default function RecommendedCarousel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const listRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/recommendations/recent")
            .then((res) => {
                console.log("🔥 추천 API 응답:", res.data);
                const list = res.data.cards || res.data || [];
                setItems(list);
            })
            .catch((err) => {
                console.error("추천 API 에러:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const scroll = (direction) => {
        const container = listRef.current;
        if (!container) return;

        const card = container.querySelector(".recommend-card");
        if (!card) return;

        const cardWidth = card.offsetWidth + 24; // gap 24px 가정
        const delta = direction === "left" ? -cardWidth : cardWidth;
        container.scrollBy({ left: delta, behavior: "smooth" });
    };

    if (!loading && items.length === 0) {
        return (
            <section className="recommend-section">
                <h2 className="recommend-section-title">다른 지역은 어떠세요?</h2>
                <p style={{ padding: "1rem", color: "#888" }}>
                    아직 추천할 프로그램이 없습니다.
                </p>
            </section>
        );
    }

    return (
        <section className="recommend-section">
            <h2 className="recommend-section-title">다른 지역은 어떠세요?</h2>

            <div className="recommend-carousel">
                <button
                    className="recommend-arrow recommend-arrow-left"
                    onClick={() => scroll("left")}
                >
                    ‹
                </button>

                <div className="recommend-list" ref={listRef}>
                    {items.map((p) => (
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

                <button
                    className="recommend-arrow recommend-arrow-right"
                    onClick={() => scroll("right")}
                >
                    ›
                </button>
            </div>
        </section>
    );
}
