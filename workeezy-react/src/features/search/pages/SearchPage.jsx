import PageLayout from "../../../Layout/PageLayout.jsx";
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
    const [regions, setRegions] = useState(["전체"]);   // ⭐ 기본값: 전체 선택
    const [allPrograms, setAllPrograms] = useState([]);
    const [recommended, setRecommended] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6; // ⭐ 한 페이지 6개
    const [bigRegion, setBigRegion] = useState("전체");
    const [smallRegions, setSmallRegions] = useState([]);


    // 로그인 사용자
    let userId = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
    }

    // 프로그램 전체 로드
    useEffect(() => {
        publicApi
            .get("/api/programs/cards")
            .then((res) => setAllPrograms(res.data))
            .catch((err) => console.log(err));
    }, []);

    // ⭐ 검색 요청 처리
    const handleSearch = () => {
        if (!search.trim()) return;

        publicApi
            .get("/api/search", {
                params: {
                    keyword: search,
                    userId: userId,
                    regions: regions.includes("전체") ? [] : regions,
                },
            })
            .then((res) => {
                setAllPrograms(res.data.cards);
                setRecommended(res.data.recommended);
                setCurrentPage(1);
            })
            .catch((err) => console.log(err));
    };

    // ⭐ 지역 카테고리 토글
    const toggleRegion = (region) => {
        // 전체 선택 시 → 전체만 남기기
        if (region === "전체") {
            setRegions(["전체"]);
            setCurrentPage(1);
            return;
        }

        // 지역 선택 시 → 전체 제거 후 개별 지역 토글
        setRegions((prev) => {
            const cleaned = prev.filter((r) => r !== "전체");

            // 이미 선택됨 → 제거
            if (cleaned.includes(region)) {
                return cleaned.filter((r) => r !== region);
            }

            // 추가
            return [...cleaned, region];
        });

        setCurrentPage(1);
    };


    // ⭐ 최종 필터링
    const filteredPrograms = allPrograms.filter((p) => {

        // 전체 선택 시 필터 적용 X
        if (bigRegion === "전체") return true;

        // 1차 영역 필터
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

        // 작은 지역이 선택되었을 때
        if (smallRegions.length > 0 && !smallRegions.includes(p.region)) {
            return false;
        }

        // 작은 지역이 선택되지 않은 경우 → 1차 그룹만 검사
        if (smallRegions.length === 0 && !validSmall.includes(p.region)) {
            return false;
        }

        return true;
    });


    // ⭐ 페이지네이션 계산
    const totalPages = Math.ceil(filteredPrograms.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paginatedPrograms = filteredPrograms.slice(start, start + pageSize);

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
            <CategoryFilter
                bigRegion={bigRegion}
                setBigRegion={setBigRegion}
                smallRegions={smallRegions}
                setSmallRegions={setSmallRegions}
            />



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

            {/* ⭐ 페이지당 6개만 출력 */}
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
