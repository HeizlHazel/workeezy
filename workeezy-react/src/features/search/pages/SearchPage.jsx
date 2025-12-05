import PageLayout from "../../../layout/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../../../shared/common/Pagination.jsx";
import FloatingButtons from "../../../shared/common/FloatingButtons.jsx";
import SearchCard from "../components/SearchCard.jsx";

import publicApi from "../../../api/publicApi.js";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function SearchPage() {
    const [search, setSearch] = useState("");
    const [regions, setRegions] = useState([]);        // ⭐ 다중 카테고리 선택
    const [allPrograms, setAllPrograms] = useState([]); // ⭐ 전체 데이터
    const [recommended, setRecommended] = useState([]); // 추천 데이터

    // 로그인한 사용자 ID
    let userId = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
    }

    // -----------------------------------
    // ⭐ 초기 로드시 전체 프로그램 불러오기
    // -----------------------------------
    useEffect(() => {
        publicApi
            .get("/api/programs/cards")
            .then((res) => setAllPrograms(res.data))
            .catch((err) => console.log(err));
    }, []);

    // -----------------------------------
    // ⭐ 검색 수행 시 → 서버 검색 + 추천 업데이트
    // -----------------------------------
    const handleSearch = () => {
        if (!search.trim()) return;

        publicApi
            .get("/api/search", {
                params: {
                    keyword: search,
                    userId: userId,
                    regions: regions, // 🔥 백엔드 DTO가 List<String> 받도록 되어있음
                },
            })
            .then((res) => {
                setAllPrograms(res.data.cards);     // 검색된 프로그램 리스트로 변경
                setRecommended(res.data.recommended);
            })
            .catch((err) => console.log(err));
    };

    // -----------------------------------
    // ⭐ 카테고리 필터 변경 시 → UI에서만 필터링 (서버 호출 X)
    // -----------------------------------
    const toggleRegion = (region) => {
        setRegions((prev) =>
            prev.includes(region)
                ? prev.filter((r) => r !== region)
                : [...prev, region]
        );
    };

    // -----------------------------------
    // ⭐ 최종 필터링된 프로그램 목록 계산 (렌더링 시 자동 계산)
    // -----------------------------------
    const filteredPrograms = allPrograms.filter((p) => {
        // 지역 필터 활성화 시
        if (regions.length > 0 && !regions.includes(p.region)) return false;

        // 검색어가 존재할 때
        if (search.trim() && !p.title.includes(search)) return false;

        return true;
    });

    return (
        <PageLayout>
            <h2>Search</h2>

            {/* 검색창 */}
            <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
            />

            {/* 카테고리 필터 */}
            <CategoryFilter activeList={regions} onToggle={toggleRegion} />

            {/* 추천 프로그램 */}
            {recommended.length > 0 && (
                <>
                    <h3>추천 프로그램</h3>
                    <div className="search-grid">
                        {recommended.map((p) => (
                            <SearchCard
                                key={p.id}
                                id={p.id}
                                title={p.title}
                                photo={p.photo}
                                price={p.price}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* 검색/카테고리 반영된 결과 */}
            <h3>검색 결과</h3>
            <div className="search-grid">
                {filteredPrograms.map((p) => (
                    <SearchCard
                        key={p.id}
                        id={p.id}
                        title={p.title}
                        photo={p.photo}
                        price={p.price}
                        region={p.region}
                    />
                ))}
            </div>

            <Pagination />
            <FloatingButtons />
        </PageLayout>
    );
}
