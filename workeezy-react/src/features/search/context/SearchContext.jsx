import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import api from "../../../api/axios.js";

const SearchContext = createContext(null);

const REGION_MAP = {
    수도권: ["서울", "경기", "인천"],
    영남권: ["부산", "대구", "울산", "경남", "경북"],
    호남권: ["광주", "전남", "전북"],
    충청권: ["대전", "충북", "충남"],
    강원권: ["강원"],
    제주: ["제주"],
    해외: ["해외"],
};

function findBigRegionBySmall(small) {
    for (const [big, list] of Object.entries(REGION_MAP)) {
        if (list.includes(small)) return big;
    }
    return "전체";
}

export function SearchProvider({children}) {
    const [params] = useSearchParams();
    const urlKeyword = params.get("keyword") || "";
    const navigate = useNavigate();

    // UI 상태
    const [searchInput, setSearchInput] = useState(urlKeyword);
    const [viewMode, setViewMode] = useState("list"); // "list" | "map"

    // 필터 상태
    const [bigRegion, setBigRegionState] = useState("전체");
    const [smallRegions, setSmallRegionsState] = useState([]);

    // 데이터 상태
    const [allPrograms, setAllPrograms] = useState([]);
    const [recommended, setRecommended] = useState([]);

    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // urlKeyword -> input 동기화
    useEffect(() => {
        setSearchInput(urlKeyword);
        setCurrentPage(1);
    }, [urlKeyword]);

    // 추천 persist
    const STORAGE_KEY = "workeezy_recommended_v1";

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setRecommended(JSON.parse(saved));
        } catch (e) {
            console.error("recommended restore failed", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recommended));
        } catch (e) {
            console.error("recommended save failed", e);
        }
    }, [recommended]);

    // 검색 데이터 fetch
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                if (!urlKeyword || urlKeyword.trim() === "") {
                    const res = await api.get("/api/programs/cards");
                    if (!cancelled) setAllPrograms(res.data);
                    return;
                }

                const res = await api.get("/api/search", {
                    params: {keyword: urlKeyword, regions: []},
                });

                if (!cancelled) setAllPrograms(res.data.cards);


                // 추천 1개 누적
                const recRes = await api.get("/api/recommendations/recent");
                const incoming = recRes.data ?? [];

                if (cancelled) return;

                setRecommended((prev) => {
                    const used = new Set(prev.map((p) => p.id));
                    const nextOne = incoming.find((p) => p?.id && !used.has(p.id));
                    return nextOne ? [nextOne, ...prev].slice(0, 10) : prev;
                });

            } catch (e) {
                console.error("search error", e);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [urlKeyword]);

    // actions
    const submitSearch = useCallback(() => {
        const trimmed = searchInput.trim();
        if (trimmed === "") {
            navigate("/search");
            setSearchInput("");
            setCurrentPage(1);
            setViewMode("list");
            return;
        }
        navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
        setCurrentPage(1);
        setViewMode("list");
    }, [navigate, searchInput]);

    const setBigRegion = useCallback((r) => {
        setBigRegionState(r);
        setSmallRegionsState([]);
        setCurrentPage(1);
        setViewMode("list");
    }, []);

    const setSmallRegions = useCallback((updaterOrList) => {
        setSmallRegionsState((prev) => {
            const next =
                typeof updaterOrList === "function" ? updaterOrList(prev) : updaterOrList;

            if (next?.length > 0) {
                setBigRegionState(findBigRegionBySmall(next[0]));
            }
            return next;
        });
        setCurrentPage(1);
        setViewMode("list");
    }, []);

    // derived: filtered
    const filteredPrograms = useMemo(() => {
        return allPrograms.filter((p) => {
            if (bigRegion !== "전체") {
                const validSmall = REGION_MAP[bigRegion] || [];
                if (!p.region || !validSmall.includes(p.region)) return false;
            }
            if (smallRegions.length > 0) {
                if (!smallRegions.includes(p.region)) return false;
            }
            return true;
        });
    }, [allPrograms, bigRegion, smallRegions]);

    // derived: pagination
    const totalPages = Math.ceil(filteredPrograms.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const paginatedPrograms = filteredPrograms.slice(start, start + pageSize);
    const isEmpty = paginatedPrograms.length === 0;

    const value = {
        // UI
        searchInput,
        setSearchInput,
        submitSearch,
        viewMode,
        setViewMode,

        // filter
        bigRegion,
        smallRegions,
        setBigRegion,
        setSmallRegions,

        // programs
        allPrograms,
        filteredPrograms,
        paginatedPrograms,
        isEmpty,

        // pagination
        currentPage,
        setCurrentPage,
        totalPages,
        pageSize,

        // recommended
        recommended,
    };

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be used within SearchProvider");
    return ctx;
}