import "./ReservationCard.css";
import ReservationStatusButton from "../../../../shared/common/ReservationStatusButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatLocalDateTime } from "../../../../utils/dateTime";

export default function ReservationCard({ data, isSelected, onSelect }) {
  const navigate = useNavigate();
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
    reservationNo,
    officeName,
  } = data;

  const handleCancel = async () => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    const token = localStorage.getItem("accessToken");

    await axios.patch(
      `/api/reservations/${data.id}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("예약이 취소되었습니다.");
    window.location.reload();
  };

  return (
    <div
      className={`reservation-card ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected ? (
        <div className="image-grid">
          {images.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>
      ) : (
        <img className="thumbnail" src={images[0]} alt="" />
      )}

      <div className="info">
        <ReservationStatusButton status={status} />
        <div className="title">{programTitle}</div>

        <dl className="details">
          <div>
            <dt>예약번호</dt>
            <dd>{reservationNo}</dd>
          </div>
          <div>
            <dt>기간</dt>
            <dd>
              {formatLocalDateTime(startDate)} ~ {formatLocalDateTime(endDate)}
            </dd>
          </div>
          <div>
            <dt>숙소</dt>
            <dd>{stayName}</dd>
          </div>

          <div>
            <dt>오피스</dt>
            <dd>{officeName}</dd>
          </div>

          <div>
            <dt>총 금액</dt>
            <dd>{totalPrice?.toLocaleString()}원</dd>
          </div>
        </dl>

        {isSelected && (
          <dl className="detail-extra">
            <h4 className="detail-title">예약 상세</h4>
            <div>
              <dt>룸타입</dt>
              <dd>{roomType}</dd>
            </div>
            <div>
              <dt>인원</dt>
              <dd>{peopleCount}명</dd>
            </div>
          </dl>
        )}
      </div>

      {isSelected && (
        <div className="buttons">
          <button onClick={() => navigate(`/reservation/edit/${data.id}`)}>
            예약 변경
          </button>
          <button onClick={handleCancel}>예약 취소</button>
        </div>
      )}
    </div>
  );
}
