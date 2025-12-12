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
    const autoPlayRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/recommendations/recent")
            .then((res) => {
                console.log("🔥 추천 API 응답:", res.data);
                const list = res.data || [];
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

        const cardWidth = card.offsetWidth + 24;
        const delta = direction === "left" ? -cardWidth : cardWidth;

        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const current = container.scrollLeft;
        const next = current + delta;

        if (direction === "right") {
            // 끝에 거의 다 갔으면 → 맨 앞으로 순간 이동 (회전 느낌)
            if (next >= maxScrollLeft - 5) {
                container.scrollTo({ left: 0, behavior: "auto" });
            } else {
                container.scrollBy({ left: delta, behavior: "smooth" });
            }
        } else {
            // 왼쪽으로 가다가 거의 맨 앞이면 → 맨 끝으로 점프
            if (next <= 0) {
                container.scrollTo({ left: maxScrollLeft, behavior: "auto" });
            } else {
                container.scrollBy({ left: delta, behavior: "smooth" });
            }
        }
    };

    useEffect(() => {
        if (items.length === 0) return;

        autoPlayRef.current = setInterval(() => {
            scroll("right");
        }, 3000);

        return () => {
            if(autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [items]);

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
                    {items.map((p) => (
                        <RecommendedCard
                            key={p.id}                    // ✅ 이제 항상 고유 id 있음
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
