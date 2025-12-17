import { useEffect, useState } from "react";
import axios from "../../../../api/axios.js";
import ReservationListView from "./ReservationListView.jsx";

export default function ReservationListContainer({
  selectedId, // 선택된 예약카드 id
  setSelectedId, // 클릭시 선택된 예약을 바꾸는 함수
}) {
  const [reservations, setReservations] = useState([]); // 서버에서 불러온 예약 목록 저장
  const [loading, setLoading] = useState(true); // 데이터 로딩 표시
  const [error, setError] = useState(null); // 에러 메시지 저장

  // 해당 사용자의 예약 불러오기
  useEffect(() => {
    const fetchMyReservations = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:8080/api/reservations/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReservations(res.data);
        // console.log("서버 응답 데이터:", res.data);
      } catch (err) {
        setError("예약 목록 불러오기 실패");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservations();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ReservationListView
      reservations={reservations}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    />
  );
}
