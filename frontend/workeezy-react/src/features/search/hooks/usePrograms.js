import { useEffect, useState } from "react";
import api from "../../../api/axios.js";

export default function usePrograms(urlKeyword, onAfterSearch) {
    const [allPrograms, setAllPrograms] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const fetch = async () => {
            try {
                if (!urlKeyword) {
                    const res = await api.get("/api/programs/cards");
                    if (!cancelled) setAllPrograms(res.data);
                    return;
                }

                const res = await api.get("/api/search", {
                    params: { keyword: urlKeyword, regions: [] },
                });
                if (!cancelled) setAllPrograms(res.data.cards);

                if (onAfterSearch) await onAfterSearch();
            } catch (e) {
                console.error("search error", e);
            }
        };

        fetch();
        return () => (cancelled = true);
    }, [urlKeyword, onAfterSearch]);

    return { allPrograms };
}
