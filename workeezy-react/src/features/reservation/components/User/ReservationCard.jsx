import "./ReservationCard.css";
import ReservationStatusButton from "../ReservationStatusButton.jsx";
import { formatLocalDateTime } from "../../../../utils/dateTime";
import ReservationCardActions from "./../ReservationCardActions";
import useImagePath from "../../../../hooks/useImagePath.js";

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
    // images = [],
    reservationNo,
    officeName,
    placePhoto1,
    placePhoto2,
    placePhoto3,
  } = data;
  const { fixPath } = useImagePath();
  // 🔥 핵심: placePhoto → images 배열로 변환
  const images = [placePhoto1, placePhoto2, placePhoto3]
    .filter(Boolean)
    .map(fixPath);

  return (
    <div
      className={`reservation-card ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 이미지 영역 */}
      {isSelected ? (
        <div className="image-grid">
          {images.map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>
      ) : (
        <img className="thumbnail" src={images[0]} alt="" />
      )}

      {/* 정보 섹션 */}
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

      {/* 버튼 */}
      {isSelected && (
        <div className="buttons">
          <ReservationCardActions reservation={data} />
        </div>
      )}
    </div>
  );
}
