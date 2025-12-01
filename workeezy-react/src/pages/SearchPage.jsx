import PageLayout from "../layout/PageLayout";
import SearchBar from "../components/Search/SearchBar.jsx";
import CategoryFilter from "../components/Search/CategoryFilter.jsx";
import Pagination from "../components/Common/Pagination.jsx";
import { useState } from "react";
import FloatingButtons from "../components/Common/FloatingButtons.jsx";
import SearchCard from "../components/Search/SearchCard.jsx";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");

  const mock = [
    {
      title: "부산 영도 워케이션",
      image: "/public/a161ab83-1b52-4475-b7e3-f75afb932943.png",
      desc: `참가비\n70,000원 / 2박~`,
    },
    {
      title: "울산 동구 워케이션",
      image: "/public/ac95ce1d-57d6-4862-9e4e-fabfadd1e5a2.png",
      desc: "완전 힐링...",
      rating: 4,
    },
    {
      title: "강원 속초 워케이션",
      image: "/public/c7209850-7773-481f-af51-511736fcf47d.png",
      desc: "시설 좋음...",
      rating: 5,
    },
    {
      title: "강원 양양 어촌체험",
      image: "public/db333417-b310-4ba1-ac03-33cd2b71f553.png",
      desc: "음식 맛있음...",
      rating: 4,
    },
    {
      title: "남해 지족 휴양마을",
      image: "public/db333417-b310-4ba1-ac03-33cd2b71f553.png",
      desc: "전망이 좋음...",
      rating: 5,
    },
    {
      title: "오키나와 나고 워케이션",
      image: "public/db333417-b310-4ba1-ac03-33cd2b71f553.png",
      desc: "이국적...",
      rating: 3,
    },
  ];

  return (
    <PageLayout>
      <h2>Search</h2>
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter active={region} onSelect={setRegion} />

      <div className="review-grid">
        {mock.map((r, i) => (
          <SearchCard key={i} {...r} />
        ))}
      </div>

      <Pagination />
      <FloatingButtons />
    </PageLayout>
  );
}
