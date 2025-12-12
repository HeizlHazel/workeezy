import PageLayout from "../../../Layout/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Pagination from "../../../shared/common/Pagination.jsx";
import FloatingButtons from "../../../shared/common/FloatingButtons.jsx";
import SearchCard from "../components/SearchCard.jsx";
import RecommendedCarousel from "../components/RecommendedCarousel.jsx";

import {useEffect, useRef, useState} from "react";
import { jwtDecode } from "jwt-decode";
import SectionHeader from "../../../shared/common/SectionHeader.jsx";

import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axios.js";

export default function SearchPage() {
    // ---------------------------------------------
    // ⭐ URL keyword 읽기
    // ---------------------------------------------
    const [params] = useSearchParams();
    const urlKeyword = params.get("keyword") || "";
    const navigate = useNavigate();

    // ---------------------------------------------
    // ⭐ 검색 상태 (초기값 = URL keyword)
    // ---------------------------------------------
    const [search, setSearch] = useState(() => urlKeyword);

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

    // ---------------------------------------------------------
    // ⭐ URL 변경 시 검색창(search) 동기화
    // ---------------------------------------------------------
    const initialized = useRef(false);


    useEffect(() => {
        setSearch(urlKeyword);
    }, [urlKeyword]);



    // ---------------------------------------------------------
    // ⭐ URL keyword 변경 시:
    //    keyword 있으면 → 검색 API
    //    keyword 없으면 → 전체 프로그램 로드
    // ---------------------------------------------------------

    useEffect(() => {
        console.log("🔥 API 호출 keyword:", urlKeyword);

        if (urlKeyword && urlKeyword.trim() !== "") {
            api.get("/api/search", {
                params: { keyword: urlKeyword, regions: [] }
            }).then(res => {
                console.log("🔥 검색 API 응답(cards):", res.data.cards);
                setAllPrograms(res.data.cards);
                setRecommended(res.data.recommended);
            });
        } else {
            api.get("/api/programs/cards")
                .then(res => {
                    console.log("🔥 전체목록 API 응답:", res.data);
                    setAllPrograms(res.data);
                });
        }
    }, [urlKeyword]);




    // ---------------------------------------------------------
    // ⭐ 검색 버튼 / 엔터 → URL 이동
    // ---------------------------------------------------------
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




    // ---------------------------------------------------------
    // ⭐ 최종 필터링 (title + region 만 필터링)
    // ---------------------------------------------------------
    const filteredPrograms = allPrograms.filter((p) => {
        const keyword = search.trim().toLowerCase();



        // 🌍 대지역 필터
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

        // 🔽 소지역 필터
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
                onSearch={handleSearch}  // 검색 = URL 이동
            />

            {/* 🗂 지역 카테고리 */}
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

            {/*/!* ⭐ 추천 프로그램 *!/*/}
            {/*{recommended.length > 0 && (*/}
            {/*    <>*/}
            {/*        <h3>추천 프로그램</h3>*/}
            {/*        <div className="search-grid">*/}
            {/*            {recommended.map((p) => (*/}
            {/*                <SearchCard*/}
            {/*                    key={p.id}*/}
            {/*                    id={p.id}*/}
            {/*                    title={p.title}*/}
            {/*                    photo={p.photo}*/}
            {/*                    price={p.price}*/}
            {/*                />*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}

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

            <RecommendedCarousel/>
        </PageLayout>
    );
}
