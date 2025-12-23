import SearchBar from "./SearchBar.jsx";
import { useSearch } from "../context/SearchContext.jsx";

export default function SearchBarConnected() {
    const { searchInput, setSearchInput, submitSearch } = useSearch();

    return (
        <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={submitSearch}
        />
    );
}
