import KoreaSvgMap from "./KoreaSvgMap.jsx";
import "./MapView.css";

export default function MapView({
                                    programs = [],
                                    bigRegion,
                                    smallRegions = [],
                                    onPickRegion,        // ✅ 지도에서 지역 클릭 시 콜백 (small 1개)
                                    onChangeBigRegion,   // ✅ 지도 상단 칩으로 bigRegion 변경 시 콜백
                                }) {
    // 지역별 개수
    const counts = programs.reduce((acc, p) => {
        const r = p?.region;
        if (!r) return acc;
        acc[r] = (acc[r] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="map-wrap">
            <div className="map-top-chips">
                <button className="chip" onClick={() => onChangeBigRegion?.("전체")}>
                    전체
                </button>
                <button className="chip" onClick={() => onChangeBigRegion?.("수도권")}>
                    국내(예: 수도권)
                </button>
                <button className="chip" onClick={() => onChangeBigRegion?.("해외")}>
                    해외
                </button>
            </div>

            <div className="map-stage">
                <div className="map-frame">
                    <KoreaSvgMap
                        counts={counts}
                        selectedRegion={smallRegions?.[0] || null}
                        onPick={(small) => onPickRegion?.(small)} // ✅ "부산" 같은 값
                    />
                </div>
            </div>

            <p className="map-hint">지역을 클릭하면 리스트로 이동해 결과를 보여줘요.</p>
        </div>
    );
}
