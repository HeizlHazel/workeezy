import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendedCard from "./RecommendedCard";

import "./RecommendecCarousel.css"
import api from "../../../api/axios.js";

export default function RecommendedCarousel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const listRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        api().get("/api/recommendations/recent")
            .then((res) => {
                setItems(res.data || []);
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

        const cardWidth = card.offsetWidth + 24;
        const delta = direction === "left" ? -cardWidth : cardWidth;
        container.scrollBy({ left: delta, behavior: "smooth" });
    };

    if (!loading && items.length === 0) return null;

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
                    {items.map((item) => (
                        <RecommendedCard
                            key={item.id}
                            item={item}
                            onClick={() => navigate(`/programs/${item.id}`)}
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
