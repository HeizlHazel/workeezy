import "./CategoryFilter.css";

export default function CategoryFilter({ active, onSelect }) {
    const categories = [
        "전체",
        "서울",
        "강원",
        "충북",
        "충남",
        "경북",
        "경남",
        "전북",
        "전남",
    ];

    return (
        <div className="category-wrapper">
            {categories.map((c) => (
                <button
                    key={c}
                    className={`category-btn ${active === c ? "active" : ""}`}
                    onClick={() => onSelect(c)}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}
