import { useEffect, useRef, useState } from "react";
import "./KoreaSvgMap.css";

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
    // ✅ XML 선언/DOCTYPE 제거 + <svg>...</svg>만 추출
    const cleaned = raw
        .replace(/<\?xml[\s\S]*?\?>/gi, "")
        .replace(/<!doctype[\s\S]*?>/gi, "")
        .trim();

    const match = cleaned.match(/<svg[\s\S]*<\/svg>/i);
    return match ? match[0] : cleaned;
}

export default function KoreaSvgMap({ selectedRegion, onPick }) {
    const wrapRef = useRef(null);
    const [svgText, setSvgText] = useState("");

    useEffect(() => {
        fetch("/southKoreaHigh.svg")
            .then((r) => {
                if (!r.ok) throw new Error(`SVG fetch failed: ${r.status}`);
                return r.text();
            })
            .then((txt) => setSvgText(extractSvgOnly(txt)))
            .catch((e) => console.error("SVG load failed:", e));
    }, []);

    // 클릭 이벤트 위임
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const handleClick = (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;

            // path가 아니면 부모 path 찾기 (svg에 g 태그/기타 있을 수 있어서)
            const path = target.closest("path");
            if (!path) return;

            const code = path.getAttribute("id");
            const regionName = code ? REGION_CODE_MAP[code] : null;
            if (!regionName) return;

            onPick?.(regionName);
        };

        el.addEventListener("click", handleClick);
        return () => el.removeEventListener("click", handleClick);
    }, [onPick]);

    // 선택 강조(active)
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const paths = el.querySelectorAll("svg path");
        paths.forEach((p) => {
            const code = p.getAttribute("id");
            const region = code ? REGION_CODE_MAP[code] : null;
            if (region && region === selectedRegion) p.classList.add("active");
            else p.classList.remove("active");
        });
    }, [selectedRegion, svgText]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        // svgText가 들어온 뒤 실제 DOM에 svg가 생긴 다음에 실행
        requestAnimationFrame(() => {
            const svg = el.querySelector("svg");
            if (!svg) return;

            // ✅ 크기 보장
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

            // ✅ 내부 path들의 bbox로 viewBox 자동 생성
            try {
                const bbox = svg.getBBox();
                const pad = 10;
                const x = bbox.x - pad;
                const y = bbox.y - pad;
                const w = bbox.width + pad * 2;
                const h = bbox.height + pad * 2;

                svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
            } catch (e) {
                console.warn("getBBox failed:", e);
                // fallback(대충이라도 보이게)
                svg.setAttribute("viewBox", "0 0 800 900");
            }
        });
    }, [svgText]);


    return (
        <div ref={wrapRef} className="korea-map-wrap">
            {!svgText ? <div className="map-loading">지도 로딩중...</div> : null}
            <div dangerouslySetInnerHTML={{ __html: svgText }} />
        </div>
    );
}
