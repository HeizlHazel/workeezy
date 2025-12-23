import { useMemo } from "react";
import KoreaSvgMap from "./KoreaSvgMap.jsx";
import "./MapView.css";
import { useSearch } from "../context/SearchContext.jsx";

export default function MapView() {
    const { filteredPrograms } = useSearch();

    const counts = useMemo(() => {
        return filteredPrograms.reduce((acc, p) => {
            const r = p?.region;
            if (!r) return acc;
            acc[r] = (acc[r] || 0) + 1;
            return acc;
        }, {});
    }, [filteredPrograms]);

    const programsByRegion = useMemo(() => {
        return filteredPrograms.reduce((acc, p) => {
            const r = p?.region;
            if (!r) return acc;
            (acc[r] ||= []).push(p);
            return acc;
        }, {});
    }, [filteredPrograms]);

    return (
        <div className="map-wrap">
            <div className="map-stage">
                <div className="map-frame">
                    <KoreaSvgMap counts={counts} programsByRegion={programsByRegion} />
                </div>
            </div>
        </div>
    );
}
