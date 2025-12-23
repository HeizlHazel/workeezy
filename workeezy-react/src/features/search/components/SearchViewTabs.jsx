import { useSearch } from "../context/SearchContext.jsx";

export default function SearchViewTabs() {
    const { viewMode, setViewMode } = useSearch();

    return (
        <div className="search-view-tabs">
            <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
            >
                리스트
            </button>
            <button
                className={viewMode === "map" ? "active" : ""}
                onClick={() => setViewMode("map")}
            >
                지도
            </button>
        </div>
    );
}
