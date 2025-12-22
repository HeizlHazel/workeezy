import { useMemo } from "react";
import KoreaSvgMap from "./KoreaSvgMap.jsx";
import "./MapView.css";

export default function MapView({ programs = [] }) {
    const counts = useMemo(() => {
        return programs.reduce((acc, p) => {
            const r = p?.region;
            if (!r) return acc;
            acc[r] = (acc[r] || 0) + 1;
            return acc;
        }, {});
    }, [programs]);

    const programsByRegion = useMemo(() => {
        return programs.reduce((acc, p) => {
            const r = p?.region;
            if (!r) return acc;
            (acc[r] ||= []).push(p);
            return acc;
        }, {});
    }, [programs]);

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
