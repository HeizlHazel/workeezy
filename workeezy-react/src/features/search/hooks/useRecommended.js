import {useEffect, useState} from "react";
import api from "../../../api/axios.js";

export default function useRecommended() {
    const [recommended, setRecommended] = useState([]);
    const KEY = "workeezy_recommended_v1";

    useEffect(() => {
        const saved = localStorage.getItem(KEY);
        if (saved) setRecommended(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(recommended));
    }, [recommended]);

    const fetchAndAppend = async () => {
        try {
            const res = await api.get("/api/recommendations/recent");

            setRecommended((prev) => {
                const used = new Set(prev.map((p) => p.id));
                const next = res.data.find((p) => !used.has(p.id));
                return next ? [next, ...prev].slice(0, 10) : prev;
            });
        } catch (e) {
            console.error("recommend fetch failed", e);
        }
    };

    return {recommended, fetchAndAppend};
}