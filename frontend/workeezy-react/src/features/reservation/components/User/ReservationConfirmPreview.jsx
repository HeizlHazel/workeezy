import "./ReservationConfirmPreview.css";

export default function ReservationConfirmPreview({ data }) {
  console.log(data);
  return (
    <div className="confirm-preview">
      <section className="confirm-section">
        <h3>예약 정보</h3>
        <dl className="info-list">
          <dt>예약번호</dt>
          <dd>{data.reservationNo}</dd>
          <dt>프로그램</dt>
          <dd>{data.programTitle}</dd>
          <dt>숙소명</dt>
          <dd>{data.stayName}</dd>
          <dt>룸타입</dt>
          <dd>{data.roomType}</dd>
          <dt>오피스명</dt>
          <dd>{data.officeName}</dd>
          <dt>이용 기간</dt>
          <dd>
            {data.startDate} ~ {data.endDate}
          </dd>
          <dt>인원수</dt>
          <dd>{data.peopleCount}</dd>
        </dl>
      </section>
      <section className="confirm-section">
        <h3>결제 정보</h3>
        <dl className="info-list">
          <dt>결제 금액</dt>
          <dd>{data.totalPrice.toLocaleString()}원</dd>
        </dl>
      </section>

      <section className="confirm-section">
        <h3>예약자 정보</h3>
        <dl className="info-list">
          <dt>이름</dt>
          <dd>{data.userName}</dd>

          <dt>연락처</dt>
          <dd>{data.phone}</dd>
          <dt>이메일</dt>
          <dd>{data.email}</dd>
        </dl>
      </section>
    </div>
  );
}
