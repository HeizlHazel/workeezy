import ReservationCard from "./ReservationCard.jsx";

export default function ReservationListView({
  reservations, // 예약 배열
  selectedId,
  setSelectedId,
}) {
  // 카드 토글
  const handleCardClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
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
  );
}
