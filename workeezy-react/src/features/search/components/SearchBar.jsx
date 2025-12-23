import "./SearchBar.css";
import { useSearch } from "../context/SearchContext.jsx";

export default function SearchBar() {
    const { searchInput, setSearchInput, submitSearch } = useSearch();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            submitSearch();
        }
    };

    return (
        <div className="search-wrapper">
            <div className="search-bar">
                <input
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <i
                    className="fa-solid fa-magnifying-glass search-icon"
                    onClick={submitSearch}
                    style={{ cursor: "pointer" }}
                />
            </div>
        </div>
    );
}
