import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function useSearchKeyword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const urlKeyword = params.get("keyword") || "";
    const [searchInput, setSearchInput] = useState(urlKeyword);

    useEffect(() => {
        setSearchInput(urlKeyword);
    }, [urlKeyword]);

    const submitSearch = () => {
        const trimmed = searchInput.trim();
        if (!trimmed) {
            navigate("/search");
            return;
        }
        navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    };

    return { searchInput, setSearchInput, urlKeyword, submitSearch };
}
