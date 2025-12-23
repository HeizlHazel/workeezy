import { useMemo, useState } from "react";

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

export default function useRegionFilter(allPrograms) {
    const [bigRegion, setBigRegion] = useState("전체");
    const [smallRegions, setSmallRegions] = useState([]);

    const filteredPrograms = useMemo(() => {
        return allPrograms.filter((p) => {
            if (bigRegion !== "전체") {
                const valid = REGION_MAP[bigRegion] || [];
                if (!valid.includes(p.region)) return false;
            }
            if (smallRegions.length > 0 && !smallRegions.includes(p.region)) return false;
            return true;
        });
    }, [allPrograms, bigRegion, smallRegions]);

    const applySmallRegions = (updater) => {
        setSmallRegions((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (next.length > 0) setBigRegion(findBigRegionBySmall(next[0]));
            return next;
        });
    };

    return {
        bigRegion,
        smallRegions,
        setBigRegion,
        setSmallRegions: applySmallRegions,
        filteredPrograms,
    };
}
