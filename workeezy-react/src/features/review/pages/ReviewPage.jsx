import PageLayout from "../../../layout/PageLayout.jsx";
import SearchBar from "../../search/components/SearchBar.jsx";
import CategoryFilter from "../../search/components/CategoryFilter.jsx";
import ReviewCard from "../../program/components/details/ReviewCard.jsx";
import Pagination from "../../../shared/common/Pagination.jsx";
import { useState } from "react";
import FloatingButtons from "../../../shared/common/FloatingButtons.jsx";
import SectionHeader from "../../../shared/common/SectionHeader.jsx";

export default function ReviewPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("전체");

  const mock = [
    {
      title: "부산 영도 워케이션",
      image: "/public/review1.png",
      desc: "너무 좋은 시간...",
      rating: 5,
    },
    {
      title: "울산 동구 워케이션",
      image: "/public/review2.png",
      desc: "완전 힐링...",
      rating: 4,
    },
    {
      title: "강원 속초 워케이션",
      image: "/public/review3.png",
      desc: "시설 좋음...",
      rating: 5,
    },
    {
      title: "강원 양양 어촌체험",
      image: "public/review4.png",
      desc: "음식 맛있음...",
      rating: 4,
    },
    {
      title: "남해 지족 휴양마을",
      image: "public/review4.png",
      desc: "전망이 좋음...",
      rating: 5,
    },
    {
      title: "오키나와 나고 워케이션",
      image: "public/review4.png",
      desc: "이국적...",
      rating: 3,
    },
  ];

  return (
    <PageLayout normal>
        <SectionHeader icon="far fa-comment" title="Review" />
        <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter active={region} onSelect={setRegion} />

      <div className="review-grid">
        {mock.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>

      <Pagination />
      <FloatingButtons />
    </PageLayout>
  );
}
