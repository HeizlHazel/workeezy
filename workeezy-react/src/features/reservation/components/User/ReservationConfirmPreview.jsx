export default function ReservationConfirmPreview({ data }) {
  return (
    <div className="confirm-preview">
      <section>
        <h3>예약 정보</h3>
        <p>예약번호: {data.reservationNo}</p>
        <p>프로그램: {data.programTitle}</p>
        <p>
          이용 기간: {data.startDate} ~ {data.endDate}
        </p>
      </section>

      <section>
        <h3>예약자 정보</h3>
        <p>이름: {data.userName}</p>
        <p>연락처: {data.phone}</p>
      </section>

      <section>
        <h3>결제 정보</h3>
        <p>결제 금액: {data.totalPrice.toLocaleString()}원</p>
        <p>결제 상태: {data.status}</p>
      </section>
    </div>
  );
}
