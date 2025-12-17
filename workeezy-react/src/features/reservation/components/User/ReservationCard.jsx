import "./ReservationCard.css";

export default function ReservationCard({ data, isSelected, onSelect }) {
  const {
    programTitle,
    stayName,
    roomType,
    status,
    startDate,
    endDate,
    totalPrice,
    peopleCount,
    images = [],
  } = data;

  // ✅ 예약 상태 표시용 버튼 (내부 함수)
  const renderStatusButton = (status) => {
    let label = "";
    let className = "";

    switch (status) {
      case "waiting_payment":
        label = "결제 대기";
        className = "status-btn waiting";
        break;
      case "confirmed":
        label = "확정";
        className = "status-btn confirmed";
        break;
      case "cancelled":
        label = "취소";
        className = "status-btn cancelled";
        break;
      default:
        label = "알 수 없음";
        className = "status-btn default";
    }

    return <span className={className}>{label}</span>;
  };

  return (
    <div
      className={`reservation-card ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation(); // 버블링 막기
        onSelect();
      }}
    >
      {/* === 이미지 섹션 === */}
      {isSelected ? (
        <div className="image-grid">
          {images.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt={`${programTitle}-${i}`} />
          ))}
        </div>
      ) : (
        <img className="thumbnail" src={images[0]} alt={programTitle} />
      )}

      {/* === 정보 섹션 === */}
      <div className="info">
        {/* 상태 버튼 */}
        {renderStatusButton(status)}

        <div className="title">{programTitle}</div>
        <div className="details">
          <p>
            기간: {startDate} ~ {endDate}
          </p>
          <p>숙소: {stayName}</p>
          <p>룸타입: {roomType}</p>
          <p>인원: {peopleCount}명</p>
          <p>금액: {totalPrice?.toLocaleString()}원</p>
        </div>
      </div>

      {/* === 선택됐을 때 보여지는 버튼 === */}
      {isSelected && (
        <div className="buttons">
          <button>예약 확정서</button>
          <button>결제 영수증</button>
          <button>예약 변경 신청</button>
          <button>예약 취소</button>
          <button>예약 변경</button>
          <button>결제하기</button>
        </div>
      )}
    </div>
  );
}
