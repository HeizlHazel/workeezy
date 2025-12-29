import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecommendedCard from "./RecommendedCard";
import "./RecommendecCarousel.css";
import { useSearch } from "../context/SearchContext.jsx";

const GAP = 24;
const TRANSITION_MS = 450;
const AUTO_MS = 3000;

export default function RecommendedCarousel() {
    const { recommended } = useSearch();
    const navigate = useNavigate();

    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const autoRef = useRef(null);

    const [cardW, setCardW] = useState(0);
    const [visibleCount, setVisibleCount] = useState(1);

    const n = recommended?.length ?? 0;
    const step = cardW ? cardW + GAP : 0;

    // ✅ 클론 포함 인덱스 (클론 앞부분 만큼에서 시작)
    const [index, setIndex] = useState(0);
    const [withTransition, setWithTransition] = useState(true);

    // ✅ 카드 너비/보이는 개수 측정 (ResizeObserver로 “정확/안끊김”)
    useEffect(() => {
        const vp = viewportRef.current;
        if (!vp) return;

        const measure = () => {
            const card = vp.querySelector(".recommend-card");
            if (!card) return;

            const w = Math.round(card.getBoundingClientRect().width);
            setCardW(w);

            const vpW = vp.clientWidth; // padding 포함 영역
            const one = w + GAP;
            const vc = one > 0 ? Math.max(1, Math.floor((vpW + GAP) / one)) : 1;

            // 여백 방지 안정성: 보이는 개수 + 2 정도 클론 확보
            setVisibleCount(Math.max(1, vc + 2));
        };

        measure();

        const ro = new ResizeObserver(() => measure());
        ro.observe(vp);

        return () => ro.disconnect();
    }, [recommended]);

    // ✅ 클론 세트 만들기: 앞에 tail, 뒤에 head
    const loopItems = useMemo(() => {
        if (!n) return [];
        const vc = Math.min(visibleCount, n);

        const head = recommended.slice(0, vc);
        const tail = recommended.slice(n - vc);

        return [...tail, ...recommended, ...head];
    }, [recommended, n, visibleCount]);

    // ✅ 시작 위치: “원본 시작” = 앞 클론 개수만큼
    useEffect(() => {
        if (!n) return;

        // transition 끄고 정확한 시작점으로
        const start = Math.min(visibleCount, n);
        setWithTransition(false);
        setIndex(start);

        const raf = requestAnimationFrame(() => setWithTransition(true));
        return () => cancelAnimationFrame(raf);
    }, [n, visibleCount]);

    // ✅ 트랙 이동 반영
    useEffect(() => {
        const track = trackRef.current;
        if (!track || !step) return;

        track.style.transition = withTransition
            ? `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
            : "none";
        track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
    }, [index, step, withTransition]);

    // ✅ 무한루프 핵심: transition 끝나고 “보이지 않게” 인덱스 보정
    useEffect(() => {
        const track = trackRef.current;
        if (!track || !n) return;

        const vc = Math.min(visibleCount, n);

        const onEnd = () => {
            // 원본 구간: [vc .. vc+n-1]
            const min = vc;
            const max = vc + n - 1;

            // 왼쪽 클론으로 넘어가면 → 원본의 대응 위치로 순간 보정
            if (index < min) {
                setWithTransition(false);
                setIndex(index + n);
                requestAnimationFrame(() => setWithTransition(true));
            }

            // 오른쪽 클론으로 넘어가면 → 원본의 대응 위치로 순간 보정
            if (index > max) {
                setWithTransition(false);
                setIndex(index - n);
                requestAnimationFrame(() => setWithTransition(true));
            }
        };

        track.addEventListener("transitionend", onEnd);
        return () => track.removeEventListener("transitionend", onEnd);
    }, [index, n, visibleCount]);

    const move = useCallback(
        (dir) => {
            if (!n) return;
            setWithTransition(true);
            setIndex((p) => (dir === "left" ? p - 1 : p + 1));
        },
        [n]
    );

    // ✅ 자동재생(원하면 hover 시 멈추는 것도 추가 가능)
    useEffect(() => {
        if (!n) return;
        if (autoRef.current) clearInterval(autoRef.current);

        autoRef.current = setInterval(() => move("right"), AUTO_MS);

        return () => {
            if (autoRef.current) clearInterval(autoRef.current);
        };
    }, [n, move]);

    if (!n) return null;

    return (
        <section className="recommend-section">
            <h2 className="recommend-section-title">다른 지역은 어떠세요?</h2>

            <div className="recommend-carousel">
                <button
                    className="recommend-arrow recommend-arrow-left"
                    onClick={() => move("left")}
                    type="button"
                >
                    ‹
                </button>

                <div className="recommend-viewport" ref={viewportRef}>
                    <div className="recommend-track" ref={trackRef}>
                        {loopItems.map((p, idx) => (
                            <RecommendedCard
                                key={`${p.id}-${idx}`} // ✅ 클론 때문에 idx 포함
                                id={p.id}
                                title={p.title}
                                photo={p.photo}
                                price={p.price}
                                region={p.region}
                                onClick={() => navigate(`/programs/${p.id}`)}
                            />
                        ))}
                    </div>
                </div>

                <button
                    className="recommend-arrow recommend-arrow-right"
                    onClick={() => move("right")}
                    type="button"
                >
                    ›
                </button>
            </div>
        </section>
    );
}
