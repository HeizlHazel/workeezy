import "./MainSearchBar.css";

export default function MainSearchBar() {
    return (
        <div className="searchBar">
            <input
                className="search"
                placeholder="가고 싶은 곳을 검색해 보세요."
            />
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </div>

    );
}
