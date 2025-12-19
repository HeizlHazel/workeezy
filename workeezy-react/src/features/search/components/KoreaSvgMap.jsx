import { useEffect, useMemo, useRef, useState } from "react";
import "./KoreaSvgMap.css";
import MapProgramMiniCard from "../components/MapProgramMiniCard.jsx";

const REGION_CODE_MAP = {
    "KR-11": "서울",
    "KR-26": "부산",
    "KR-27": "대구",
    "KR-28": "인천",
    "KR-29": "광주",
    "KR-30": "대전",
    "KR-31": "울산",
    "KR-41": "경기",
    "KR-42": "강원",
    "KR-43": "충북",
    "KR-44": "충남",
    "KR-45": "전북",
    "KR-46": "전남",
    "KR-47": "경북",
    "KR-48": "경남",
    "KR-49": "제주",
    "KR-50": "세종",
};

function extractSvgOnly(raw) {
    const cleaned = raw
        .replace(/<\?xml[\s\S]*?\?>/gi, "")
        .replace(/<!doctype[\s\S]*?>/gi, "")
        .trim();
    const match = cleaned.match(/<svg[\s\S]*<\/svg>/i);
    return match ? match[0] : cleaned;
}

export default function KoreaSvgMap({ counts = {}, programsByRegion = {} }) {
    const wrapRef = useRef(null);
    const [svgText, setSvgText] = useState("");
    const [bubble, setBubble] = useState(null); // { region, x, y }
    const [isSvgReady, setIsSvgReady] = useState(false);

    useEffect(() => {
        fetch("/southKoreaHigh.svg")
            .then((r) => {
                if (!r.ok) throw new Error(`SVG fetch failed: ${r.status}`);
                return r.text();
            })
            .then((txt) => {
                setSvgText(extractSvgOnly(txt));
                setIsSvgReady(false);
            })
            .catch((e) => console.error("SVG load failed:", e));
    }, []);

    const bubblePrograms = useMemo(() => {
        if (!bubble?.region) return [];
        return programsByRegion[bubble.region] || [];
    }, [bubble, programsByRegion]);

    // ✅ SVG viewBox는 로드 후 1번만 (클릭 때 흔들림 방지)
    useEffect(() => {
        const el = wrapRef.current;
        if (!el || !svgText || isSvgReady) return;

        requestAnimationFrame(() => {
            const svg = el.querySelector("svg");
            if (!svg) return;

            svg.removeAttribute("width");
            svg.removeAttribute("height");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

            try {
                const bbox = svg.getBBox();

                const pad = 12;

                // ✅ 여기 숫자만 조절 (클수록 위를 더 잘라서 지도가 더 위로 올라감)
                const cropTop = 60; // ⭐ 60~200 사이로 조절

                // bbox 기반 기본 값
                const x = bbox.x - pad;
                const y = bbox.y - pad + cropTop;         // ✅ y를 "아래로" 내려서 위쪽을 자름
                const w = bbox.width + pad * 2;
                const h = bbox.height + pad * 2 - cropTop; // ✅ h를 그만큼 줄여서 전체 크기는 유지

                // 안전장치(너무 줄어서 0/음수 되면 fallback)
                const safeH = Math.max(200, h);

                svg.setAttribute("viewBox", `${x} ${y} ${w} ${safeH}`);
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            } catch (e) {
                svg.setAttribute("viewBox", "0 120 800 780"); // ✅ 위 좀 자른 fallback
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            }



            setIsSvgReady(true);
        });
    }, [svgText, isSvgReady]);

    // ✅ 클릭(포인터다운)에서 스크롤 점프/포커스 점프 방지
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const lockScroll = (x, y) => {
            // 스크롤 앵커링/포커스 점프로 움직이면 즉시 복구
            requestAnimationFrame(() => window.scrollTo({ left: x, top: y, behavior: "auto" }));
            setTimeout(() => window.scrollTo({ left: x, top: y, behavior: "auto" }), 0);
        };

        const handlePointerDownCapture = (e) => {
            const x = window.scrollX;
            const y = window.scrollY;

            e.preventDefault();
            e.stopPropagation();

            const target = e.target;
            if (!(target instanceof Element)) return;

            const path = target.closest("path");
            if (!path) return;

            const code = path.getAttribute("id");
            const regionName = code ? REGION_CODE_MAP[code] : null;
            if (!regionName) return;

            const pathRect = path.getBoundingClientRect();
            const wrapRect = el.getBoundingClientRect();

            const centerX = pathRect.left + pathRect.width / 2 - wrapRect.left;
            const centerY = pathRect.top + pathRect.height / 2 - wrapRect.top;

            setBubble({
                region: regionName,
                x: centerX,
                y: centerY - 10,
            });

            lockScroll(x, y);
        };

        el.addEventListener("pointerdown", handlePointerDownCapture, {
            capture: true,
            passive: false,
        });

        return () => {
            el.removeEventListener("pointerdown", handlePointerDownCapture, {
                capture: true,
            });
        };
    }, []);

    // ✅ 지도 밖 클릭 시 닫기
    useEffect(() => {
        const onDown = (e) => {
            const el = wrapRef.current;
            if (!el) return;

            const bubbleEl = el.querySelector(".map-bubble");
            if (bubbleEl && bubbleEl.contains(e.target)) return;

            if (!el.contains(e.target)) setBubble(null);
        };

        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    // ✅ active 하이라이트
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const paths = el.querySelectorAll("svg path");
        paths.forEach((p) => {
            const code = p.getAttribute("id");
            const region = code ? REGION_CODE_MAP[code] : null;
            if (region && region === bubble?.region) p.classList.add("active");
            else p.classList.remove("active");
        });
    }, [bubble, svgText]);

    return (
        <div ref={wrapRef} className="korea-map-wrap">
            {!svgText ? <div className="map-loading">지도 로딩중...</div> : null}

            <div className="svg-host" dangerouslySetInnerHTML={{ __html: svgText }} />

            {/* ✅ 오버레이 레이어(레이아웃 영향 0) */}
            <div className="map-overlay">
                {bubble && (
                    <div
                        className="map-bubble"
                        style={{ left: bubble.x, top: bubble.y }}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="map-bubble-head">
                            <div className="map-bubble-title">
                                {bubble.region} ({counts?.[bubble.region] ?? bubblePrograms.length})
                            </div>

                            <button
                                type="button"
                                tabIndex={-1}
                                className="map-bubble-close"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBubble(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {bubblePrograms.length === 0 ? (
                            <div className="map-bubble-empty">이 지역엔 프로그램이 없어요.</div>
                        ) : (
                            <div className="map-bubble-list">
                                {bubblePrograms.slice(0, 8).map((p) => (
                                    <MapProgramMiniCard key={p.id} program={p} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
