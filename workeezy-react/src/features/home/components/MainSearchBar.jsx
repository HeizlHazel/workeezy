import { useState, useCallback } from "react";
import "./MainSearchBar.css";
import { useSearch } from "../../search/context/SearchContext.jsx";

export default function MainSearchBar() {
    const [keyword, setKeyword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { submitSearch } = useSearch();

    const handleSearch = useCallback(() => {
        const trimmed = keyword.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);

        // ✅ 검색페이지 검색바와 동일하게: submitSearch가 URL 이동까지 처리
        submitSearch(trimmed);

        // ✅ 메인 input 비우기
        setKeyword("");

        // ✅ 연타 방지용 잠깐 락 해제 (라우팅/렌더 틱 지나면 풀림)
        // 너무 길 필요 없음
        queueMicrotask(() => setIsSubmitting(false));
    }, [keyword, isSubmitting, submitSearch]);

    const onKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="main-searchBar">
            <input
                className="main-search"
                placeholder="가고 싶은 곳을 검색해 보세요."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={onKeyDown}
            />
            <i
                className={`fa-solid fa-magnifying-glass main-search-icon ${
                    isSubmitting ? "disabled" : ""
                }`}
                onClick={handleSearch}
                role="button"
                tabIndex={0}
                aria-label="검색"
            />
        </div>
    );
}
