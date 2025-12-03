import PageLayout from "../layout/PageLayout";
import SearchBar from "../components/Search/SearchBar.jsx";
import CategoryFilter from "../components/Search/CategoryFilter.jsx";
import Pagination from "../components/Common/Pagination.jsx";
import { useEffect, useState } from "react";
import FloatingButtons from "../components/Common/FloatingButtons.jsx";
import SearchCard from "../components/Search/SearchCard.jsx";
import axios from "../api/axios";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [programs, setPrograms] = useState([]);

  const handleSearch = () => {
    axios
      .get(`http://localhost:8080/api/programs/search?keyword=${search}`)
      .then((res) => {
        console.log("검색 결과:", res.data);
        setPrograms(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/programs/cards")
      .then((res) => {
        console.log("API 데이터:", res.data);
        setPrograms(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <PageLayout>
      <h2>Search</h2>
      <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
      <CategoryFilter active={region} onSelect={setRegion} />

      <div className="search-grid">
        {programs.map((p) => (
          <SearchCard
            key={p.id}
            title={p.title}
            photo={p.photo}
            price={p.price}
          />
        ))}
      </div>

      <Pagination />
      <FloatingButtons />
    </PageLayout>
  );
}
