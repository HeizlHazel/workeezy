import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainSearchBar.css";

export default function MainSearchBar() {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!keyword.trim()) return;

        // 검색페이지로 이동
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="main-searchBar">
            <input
                className="main-search"
                placeholder="가고 싶은 곳을 검색해 보세요."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={onKeyDown}
            />
            <i
                className="fa-solid fa-magnifying-glass main-search-icon"
                onClick={handleSearch}
            ></i>
        </div>
    );
}
