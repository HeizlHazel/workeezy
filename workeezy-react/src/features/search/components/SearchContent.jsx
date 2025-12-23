import { useSearch } from "../context/SearchContext.jsx";
import MapView from "./MapView.jsx";
import SearchResultGrid from "./SearchResultGrid.jsx";
import SearchPagination from "./SearchPagination.jsx";

export default function SearchContent() {
    const { viewMode, isEmpty } = useSearch();

    if (viewMode === "map") {
        return <MapView />;
    }

    return (
        <>
            {isEmpty ? (
                <div className="empty-state">
                    <p className="empty-title">검색 결과가 없어요 😢</p>
                    <p className="empty-desc">
                        검색어를 바꾸거나 지역 필터를 해제해서 다시 시도해보세요.
                    </p>
                </div>
            ) : (
                <SearchResultGrid />
            )}

            <SearchPagination />
        </>
    );
}
