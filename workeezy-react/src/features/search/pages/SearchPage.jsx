import PageLayout from "../../../layout/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../../../shared/common/Pagination.jsx";
import SearchCard from "../components/SearchCard.jsx";
import RecommendedCarousel from "../components/RecommendedCarousel.jsx";

import { useEffect, useState } from "react";
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

    // ✅ (선택) 새로고침해도 캐러셀 유지하고 싶으면 ON
    const PERSIST_RECOMMENDED = true;
    const STORAGE_KEY = "workeezy_recommended_v1";

    // ✅ 새로고침 복구
    useEffect(() => {
        if (!PERSIST_RECOMMENDED) return;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setRecommended(JSON.parse(saved));
        } catch (e) {
            console.error("recommended restore failed", e);
        }
    }, []);

    // ✅ state 저장
    useEffect(() => {
        if (!PERSIST_RECOMMENDED) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recommended));
        } catch (e) {
            console.error("recommended save failed", e);
        }
    }, [recommended]);

    // ✅ URL 변경 시 검색창 동기화
    useEffect(() => {
        setSearch(urlKeyword);
    }, [urlKeyword]);

    // ✅ 검색 실행 후: 검색 결과 로드 + 추천 1개 추가
    useEffect(() => {
        if (!urlKeyword || urlKeyword.trim() === "") {
            api.get("/api/programs/cards").then((res) => setAllPrograms(res.data));
            return;
        }

        api
            .get("/api/search", { params: { keyword: urlKeyword, regions: [] } })
            .then(async (res) => {
                // 1) 검색 결과
                setAllPrograms(res.data.cards);

                // 2) 추천 후보 리스트(최근검색어 기반 top10)
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

                // 3) 후보 중 '아직 안 나온 1개'만 골라서 추가
                setRecommended((prev) => {
                    const used = new Set(prev.map((p) => p.id));
                    const nextOne = incoming.find((p) => p?.id && !used.has(p.id));
                    if (!nextOne) return prev; // 새로 추가할 게 없으면 유지
                    return [nextOne, ...prev].slice(0, 10);
                });
            })
            .catch((err) => {
                console.error("search error", err);
            });
    }, [urlKeyword]);

    // 검색 버튼
    const handleSearch = () => {
        const trimmed = search.trim();
        if (trimmed === "") {
            navigate("/search");
            setSearch("");
            return;
        }
        navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [urlKeyword]);

    // 필터링
    const filteredPrograms = allPrograms.filter((p) => {
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
        if (smallRegions.length > 0) {
            if (!smallRegions.includes(p.region)) return false;
        }
        return true;
    });

    const totalPages = Math.ceil(filteredPrograms.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paginatedPrograms = filteredPrograms.slice(start, start + pageSize);

    return (
        <PageLayout>
            <SectionHeader icon="fas fa-search" title="Search" />

            <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />

            <CategoryFilter
                bigRegion={bigRegion}
                setBigRegion={(r) => {
                    setBigRegion(r);
                    setSmallRegions([]);
                    setCurrentPage(1);
                }}
                smallRegions={smallRegions}
                setSmallRegions={(list) => {
                    setSmallRegions(list);
                    setCurrentPage(1);
                }}
            />

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

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* ✅ 여기서 recommended 내려줌 */}
            <RecommendedCarousel items={recommended} />
        </PageLayout>
    );
}
