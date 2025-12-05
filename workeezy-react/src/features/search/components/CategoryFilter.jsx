import "./CategoryFilter.css";

export default function CategoryFilter({ activeList = [], onToggle }) {
    const categories = [
        "전체",
        "서울", "인천", "대전", "대구", "광주", "울산", "부산",
        "경기", "강원", "충북", "충남", "경북", "경남", "전북", "전남",
        "제주", "해외"
    ];

    return (
        <div className="category-wrapper">
            {categories.map((c) => (
                <button
                    key={c}
                    className={`category-btn ${
                        activeList.includes(c) ? "active" : ""
                    }`}
                    onClick={() => onToggle(c)}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}
