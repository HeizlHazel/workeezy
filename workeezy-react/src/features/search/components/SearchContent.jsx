import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext.jsx";
import MapView from "./MapView.jsx";
import SearchResultGrid from "./SearchResultGrid.jsx";
import SearchPagination from "./SearchPagination.jsx";
import "./SearchContent.css";

export default function SearchContent() {
    const { viewMode, isEmpty, isLoading } = useSearch();

    // ✅ 새로고침/첫 진입에서 튐 방지용: 처음엔 true로 시작
    const [holdHeight, setHoldHeight] = useState(true);

    useEffect(() => {
        // 로딩이 시작되면 무조건 hold 켜기
        if (isLoading) {
            setHoldHeight(true);
            return;
        }

        // 로딩이 끝나면 바로 풀지 말고, 한 박자 늦게 풀어서 "위로 튐" 방지
        const t = setTimeout(() => setHoldHeight(false), 180);
        return () => clearTimeout(t);
    }, [isLoading]);

    if (viewMode === "map") return <MapView />;

    return (
        <div className={`search-results-shell ${(isLoading || holdHeight) ? "is-loading" : ""}`}>
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

            {!isEmpty && <SearchPagination />}


        </div>
    );
}
