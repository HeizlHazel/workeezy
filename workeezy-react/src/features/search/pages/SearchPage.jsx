import PageLayout from "../../../layout/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../../../shared/common/Pagination.jsx";
import SearchCard from "../components/SearchCard.jsx";
import RecommendedCarousel from "../components/RecommendedCarousel.jsx";
import MapView from "../components/MapView.jsx";

import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../../../shared/common/SectionHeader.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axios.js";

export default function SearchPage() {
    const [params] = useSearchParams();
    const urlKeyword = params.get("keyword") || "";
    const navigate = useNavigate();

    const [search, setSearch] = useState(() => urlKeyword);

    const [allPrograms, setAllPrograms] = useState([]);
    const [recommended, setRecommended] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const [bigRegion, setBigRegion] = useState("전체");
    const [smallRegions, setSmallRegions] = useState([]);

    const [viewMode, setViewMode] = useState("list"); // "list" | "map"

    // ✅ region map (카테고리 & 지도 공용)
    const regionMap = useMemo(
        () => ({
            수도권: ["서울", "경기", "인천"],
            영남권: ["부산", "대구", "울산", "경남", "경북"],
            호남권: ["광주", "전남", "전북"],
            충청권: ["대전", "충북", "충남"],
            강원권: ["강원"],
            제주: ["제주"],
            해외: ["해외"],
        }),
        []
    );

    const findBigRegionBySmall = (small) => {
        for (const [big, list] of Object.entries(regionMap)) {
            if (list.includes(small)) return big;
        }
        return "전체";
    };

    // ✅ (선택) 새로고침해도 캐러셀 유지
    const PERSIST_RECOMMENDED = true;
    const STORAGE_KEY = "workeezy_recommended_v1";

    useEffect(() => {
        if (!PERSIST_RECOMMENDED) return;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setRecommended(JSON.parse(saved));
        } catch (e) {
            console.error("recommended restore failed", e);
        }
    }, []);

    useEffect(() => {
        if (!PERSIST_RECOMMENDED) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recommended));
        } catch (e) {
            console.error("recommended save failed", e);
        }
    }, [recommended]);

    // URL 변경 시 검색창 동기화
    useEffect(() => {
        setSearch(urlKeyword);
    }, [urlKeyword]);

    // 검색 실행 후: 결과 로드 + 추천 1개 추가
    useEffect(() => {
        if (!urlKeyword || urlKeyword.trim() === "") {
            api.get("/api/programs/cards").then((res) => setAllPrograms(res.data));
            return;
        }

        api
            .get("/api/search", { params: { keyword: urlKeyword, regions: [] } })
            .then(async (res) => {
                setAllPrograms(res.data.cards);

                let incoming = [];
                try {
                    const token = localStorage.getItem("accessToken");
                    const recRes = await api.get("/api/recommendations/recent", {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    });
                    incoming = recRes.data ?? [];
                } catch (e) {
                    console.error("recommendations fetch failed", e);
                    incoming = [];
                }

                setRecommended((prev) => {
                    const used = new Set(prev.map((p) => p.id));
                    const nextOne = incoming.find((p) => p?.id && !used.has(p.id));
                    if (!nextOne) return prev;
                    return [nextOne, ...prev].slice(0, 10);
                });
            })
            .catch((err) => console.error("search error", err));
    }, [urlKeyword]);

    // 검색 버튼
    const handleSearch = () => {
        const trimmed = search.trim();
        if (trimmed === "") {
            navigate("/search");
            setSearch("");
            setCurrentPage(1);
            setViewMode("list");
            return;
        }
        navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
        setCurrentPage(1);
        setViewMode("list");
    };

    // URL 바뀌면 페이지 1로
    useEffect(() => {
        setCurrentPage(1);
    }, [urlKeyword]);

    // ✅ CategoryFilter 변경은 무조건 리스트로 전환 (요구사항)
    const applyBigRegion = (r) => {
        setBigRegion(r);
        setSmallRegions([]);
        setCurrentPage(1);
        setViewMode("list");
    };

    const applySmallRegions = (updaterOrList) => {
        setSmallRegions((prev) => {
            const next =
                typeof updaterOrList === "function"
                    ? updaterOrList(prev)
                    : updaterOrList;

            // small 선택이 있으면 bigRegion도 맞춰줌(안전장치)
            if (next?.length > 0) {
                const big = findBigRegionBySmall(next[0]);
                setBigRegion(big);
            }
            return next;
        });

        setCurrentPage(1);
        setViewMode("list");
    };

    // 필터링
    const filteredPrograms = useMemo(() => {
        return allPrograms.filter((p) => {
            if (bigRegion !== "전체") {
                const validSmall = regionMap[bigRegion] || [];
                if (!p.region || !validSmall.includes(p.region)) return false;
            }
            if (smallRegions.length > 0) {
                if (!smallRegions.includes(p.region)) return false;
            }
            return true;
        });
    }, [allPrograms, bigRegion, smallRegions, regionMap]);

    const totalPages = Math.ceil(filteredPrograms.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paginatedPrograms = filteredPrograms.slice(start, start + pageSize);
    const isEmpty = paginatedPrograms.length === 0;

    const resetFilters = () => {
        setBigRegion("전체");
        setSmallRegions([]);
        setCurrentPage(1);
    };

    const showAll = () => {
        navigate("/search");
        setSearch("");
        resetFilters();
    };

    // ✅ 지도에서 지역 클릭 시: 기존 카테고리 메커니즘(큰/작은)으로 세팅
    const applyFromMapPick = (pickedSmallRegion) => {
        if (!pickedSmallRegion) return;

        const big = findBigRegionBySmall(pickedSmallRegion);
        setBigRegion(big);
        setSmallRegions([pickedSmallRegion]);
        setCurrentPage(1);
        setViewMode("list"); // ✅ 클릭하면 리스트로 보여주기
    };

    return (
        <PageLayout>
            <SectionHeader icon="fas fa-search" title="Search" />

            <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />

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

            <CategoryFilter
                bigRegion={bigRegion}
                setBigRegion={applyBigRegion}
                smallRegions={smallRegions}
                setSmallRegions={applySmallRegions}
            />

            {viewMode === "map" ? (
                <MapView
                    programs={filteredPrograms}
                    bigRegion={bigRegion}
                    smallRegions={smallRegions}
                    // ✅ 지도 클릭 → 카테고리 로직으로 반영
                    onPickRegion={applyFromMapPick}
                    // ✅ 지도에서 칩/버튼으로 bigRegion 바꾸는 경우도 리스트로
                    onChangeBigRegion={(r) => applyBigRegion(r)}
                />
            ) : (
                <>
                    {isEmpty ? (
                        <div className="empty-state">
                            <p className="empty-title">검색 결과가 없어요 😢</p>
                            <p className="empty-desc">
                                검색어를 바꾸거나 지역 필터를 해제해서 다시 시도해보세요.
                            </p>

                            <div className="empty-actions">
                                <button className="empty-btn" onClick={resetFilters}>
                                    필터 초기화
                                </button>
                                <button className="empty-btn outline" onClick={showAll}>
                                    전체 보기
                                </button>
                            </div>
                        </div>
                    ) : (
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
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            <RecommendedCarousel items={recommended} />
        </PageLayout>
    );
}
