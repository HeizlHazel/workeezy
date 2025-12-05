import "./MainSearchBar.css";

export default function MainSearchBar() {
    return (
        <div className="main-searchBar">
            <input
                className="main-search"
                placeholder="가고 싶은 곳을 검색해 보세요."
            />
            <i className="fa-solid fa-magnifying-glass main-search-icon"></i>
        </div>

    );
}
