import "./CategoryFilter.css";

export default function CategoryFilter({
                                           bigRegion,
                                           setBigRegion,
                                           smallRegions,
                                           setSmallRegions,
                                       }) {
    const bigCategories = [
        "수도권",
        "영남권",
        "호남권",
        "충청권",
        "강원권",
        "제주",
        "해외",
    ];

    const smallCategoryMap = {
        수도권: ["서울", "경기", "인천"],
        영남권: ["부산", "대구", "울산", "경남", "경북"],
        호남권: ["광주", "전남", "전북"],
        충청권: ["대전", "충북", "충남"],
        강원권: ["강원"],
        제주: ["제주"],
        해외: ["해외"],
    };

    const smallList = smallCategoryMap[bigRegion] || [];

    return (
        <div className="category-container">
            <div className="category-row">

                {/* ⭐ 항상 맨 왼쪽에 고정되는 전체 버튼 */}
                <button
                    className={`all-btn ${bigRegion === "전체" ? "active" : ""}`}
                    onClick={() => {
                        setBigRegion("전체");
                        setSmallRegions([]);
                    }}
                >
                    전체
                </button>

                {/* ⭐ 전체가 선택된 경우 → 1차 카테고리 표시 */}
                {bigRegion === "전체" && (
                    <div className="category-buttons">
                        {bigCategories.map((c) => (
                            <button
                                key={c}
                                className="category-btn"
                                onClick={() => {
                                    setBigRegion(c);
                                    setSmallRegions([]);
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {/* ⭐ 1차 클릭된 경우 → 해당 2차 카테고리만 표시 */}
                {bigRegion !== "전체" && (
                    <div className="category-buttons">
                        {smallList.map((s) => (
                            <button
                                key={s}
                                className={`category-btn ${
                                    smallRegions.includes(s) ? "active" : ""
                                }`}
                                onClick={() =>
                                    setSmallRegions((prev) =>
                                        prev.includes(s)
                                            ? prev.filter((r) => r !== s)
                                            : [...prev, s]
                                    )
                                }
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
