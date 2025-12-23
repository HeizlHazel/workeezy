import { useSearch } from "../context/SearchContext.jsx";
import SearchCard from "./SearchCard.jsx";

export default function SearchResultsGrid() {
  const { paginatedPrograms } = useSearch();

  return (
    <div className="search-grid">
      {paginatedPrograms.map((p) => (
        <SearchCard
          key={p.id}
          id={p.id}
          title={p.title}
          photo={p.photo}
          price={p.price}
          region={p.region}
        />
      ))}
    </div>
  );
}
