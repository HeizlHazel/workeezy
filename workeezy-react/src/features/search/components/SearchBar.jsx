import { useEffect, useRef, useState } from "react";
import api from "../../../api/axios.js";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSearch, maxSuggest = 6 }) {
    const [open, setOpen] = useState(false);
    const [recentKeywords, setRecentKeywords] = useState([]);
    const wrapperRef = useRef(null);

    const fetchRecent = async () => {
        try {
            const res = await api.get("/api/search/recent?limit=10");
            setRecentKeywords(res.data ?? []);
        } catch (e) {
            setRecentKeywords([]);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (!wrapperRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const keyword = (value ?? "").trim();
    const filtered =
        keyword.length === 0
            ? recentKeywords
            : recentKeywords.filter((k) => (k ?? "").includes(keyword));

    const shown = filtered.slice(0, maxSuggest); // ✅ 너무 많으면 잘라서 보여주기

    const handleSelect = (k) => {
        onChange?.(k);
        onSearch?.(k);        // ✅ 선택한 키워드를 직접 검색으로 넘김 (핵심)
        setOpen(false);
    };

    const handleSubmit = () => {
        const q = (value ?? "").trim();
        if (!q) return;
        onSearch?.(q);        // ✅ 엔터/아이콘도 현재 value를 넘김
        setOpen(false);
    };

    return (
        <div className="search-wrapper" ref={wrapperRef}>
            <div className="search-container">
                <div className="search-bar">
                    <input
                        className="search-input"
                        placeholder="검색어를 입력하세요"
                        value={value ?? ""}
                        onChange={(e) => {
                            onChange?.(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={async () => {
                            setOpen(true);
                            await fetchRecent();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                            if (e.key === "Escape") setOpen(false);
                        }}
                    />

                    <i
                        className="fa-solid fa-magnifying-glass search-icon"
                        onClick={handleSubmit}
                    />
                </div>

                {open && shown.length > 0 && (
                    <div className="search-suggest">
                        {shown.map((k, i) => (
                            <button
                                key={`${k}-${i}`}
                                type="button"
                                className="suggest-item"
                                onClick={() => handleSelect(k)}
                            >
                                <i className="fa-solid fa-clock-rotate-left" />
                                <span className="suggest-text">{k}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
