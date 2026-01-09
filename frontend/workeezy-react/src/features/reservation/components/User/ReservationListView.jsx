import ReservationCard from "./ReservationCard.jsx";
import "./ReservationListView.css";

export default function ReservationListView({
  reservations, // 예약 배열
  selectedId,
  setSelectedId,
  keyword,
  setKeyword,
  status,
  setStatus,
}) {
  // 카드 토글
  const handleCardClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* 🔍 검색 필터 */}
      <div className="reservation-filter">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="waiting_payment">예약 신청</option>
          <option value="approved">승인 완료</option>
          <option value="rejected">승인 거절</option>
          <option value="confirmed">예약 확정</option>
          <option value="cancel_requested">취소 요청</option>
          <option value="cancelled">취소 완료</option>
        </select>
        <input
          type="text"
          placeholder="워케이션 제목 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="reservation-list">
        {/* 해당 사용자의 예약 목록이 없을 시 */}
        {reservations.length === 0 ? (
          <p>예약 내역이 없습니다 😢</p>
        ) : (
          reservations.map((r) => (
            <ReservationCard
              key={r.id} // 각 카드 구분
              data={r} // 예약 데이터 한 객체
              isSelected={selectedId === r.reservationNo} // 지금 선택된 id와 카드 id 같으면 isSelected => true
              onSelect={() => handleCardClick(r.reservationNo)} // 클릭했을 때 실행될 함수.
            />
          ))
        )}
      </div>
    </>
  );
}
