import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSearch }) {

    // Enter 키로 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="search-wrapper">
            <div className="search-bar">
                <input
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}   // 🔥 Enter 검색
                />

                {/* 돋보기 아이콘 클릭 시 검색 실행 */}
                <i
                    className="fa-solid fa-magnifying-glass search-icon"
                    onClick={onSearch}           // 🔥 버튼처럼 동작
                    style={{ cursor: "pointer" }}
                />
            </div>
        </div>
    );
}
