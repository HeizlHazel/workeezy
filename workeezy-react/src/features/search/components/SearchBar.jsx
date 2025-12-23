import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSearch }) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") onSearch?.();
    };

    return (
        <div className="search-wrapper">
            <div className="search-bar">
                <input
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={value ?? ""}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <i
                    className="fa-solid fa-magnifying-glass search-icon"
                    onClick={onSearch}
                    style={{ cursor: "pointer" }}
                />
            </div>
        </div>
    );
}
