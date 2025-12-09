import PageLayout from "../../../Layout/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../../../shared/common/Pagination.jsx";
import FloatingButtons from "../../../shared/common/FloatingButtons.jsx";
import SearchCard from "../components/SearchCard.jsx";

import publicApi from "../../../api/publicApi.js";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SectionHeader from "../../../shared/common/SectionHeader.jsx";

export default function SearchPage() {
    const [search, setSearch] = useState("");
    const [allPrograms, setAllPrograms] = useState([]);
    const [recommended, setRecommended] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // ⭐ 지역 필터 상태
    const [bigRegion, setBigRegion] = useState("전체");
    const [smallRegions, setSmallRegions] = useState([]);

    // ⭐ 로그인 사용자
    let userId = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
    }

    // ⭐ 페이지 최초 로드
    useEffect(() => {
        publicApi
            .get("/api/programs/cards")
            .then((res) => setAllPrograms(res.data))
            .catch((err) => console.log("프로그램 로드 실패:", err));
    }, []);

    // ⭐ 검색 API 호출
    const handleSearch = () => {
        if (!search.trim()) return;

        publicApi
            .get("/api/search", {
                params: {
                    keyword: search,
                    userId: userId,
                    regions: [], // 여긴 DB 검색 시 지역 필터 넣고 싶으면 넣으면 됨
                },
            })
            .then((res) => {
                setAllPrograms(res.data.cards);
                setRecommended(res.data.recommended);
                setCurrentPage(1);
            })
            .catch((err) => console.log("검색 실패:", err));
    };

    // ---------------------------------------------------------
    // ⭐ 최종 필터링 (검색어 + 지역필터 모두 반영)
    // ---------------------------------------------------------
    const filteredPrograms = allPrograms.filter((p) => {
        const keyword = search.trim().toLowerCase();

        // 🔍 1) 검색어 필터
        if (keyword) {
            const match =
                (p.title && p.title.toLowerCase().includes(keyword)) ||
                (p.region && p.region.toLowerCase().includes(keyword)) ||
                (p.address && p.address.toLowerCase().includes(keyword)) ||
                (p.info && p.info.toLowerCase().includes(keyword));

            if (!match) return false;
        }

        // 🌎 2) 지역 필터
        if (bigRegion !== "전체") {
            const regionMap = {
                수도권: ["서울", "경기", "인천"],
                영남권: ["부산", "대구", "울산", "경남", "경북"],
                호남권: ["광주", "전남", "전북"],
                충청권: ["대전", "충북", "충남"],
                강원권: ["강원"],
                제주: ["제주"],
                해외: ["해외"],
            };

            const validSmall = regionMap[bigRegion] || [];

            if (!p.region || !validSmall.includes(p.region)) return false;
        }

        // 🔽 3) 작은 지역 선택 시
        if (smallRegions.length > 0) {
            if (!smallRegions.includes(p.region)) return false;
        }

        return true;
    });

    // ⭐ 페이지네이션 계산
    const totalPages = Math.ceil(filteredPrograms.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paginatedPrograms = filteredPrograms.slice(start, start + pageSize);

    return (
        <PageLayout>
            <SectionHeader icon="fas fa-search" title="Search" />

            {/* 🔍 검색창 */}
            <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
            />

            {/* 🗂 지역 카테고리 */}
            <CategoryFilter
                bigRegion={bigRegion}
                setBigRegion={(r) => {
                    setBigRegion(r);
                    setSmallRegions([]); // 1차 지역 바뀌면 2차 초기화
                    setCurrentPage(1);
                }}
                smallRegions={smallRegions}
                setSmallRegions={(list) => {
                    setSmallRegions(list);
                    setCurrentPage(1);
                }}
            />

            {/* ⭐ 추천 프로그램 */}
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

            {/* ⭐ 필터링된 프로그램 목록 */}
            <div className="search-grid">
                {paginatedPrograms.map((p) => (
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

            {/* ⭐ 페이지네이션 */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <FloatingButtons />
        </PageLayout>
    );
}
