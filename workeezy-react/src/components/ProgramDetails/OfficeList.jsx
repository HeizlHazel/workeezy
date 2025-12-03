import "./OfficeList.css";

export default function OfficeList() {
  return (
    <section className="OfficeList">
      <h3>오피스 정보</h3>
      <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
      <br />

      <div className="pd-office-card">
        <img
          src="/public/db333417-b310-4ba1-ac03-33cd2b71f553.png"
          className="pd-office-img"
        />
        <div className="pd-office-info">
          <div className="pd-office-title">부산 워케이션 거점센터</div>
          <div className="pd-office-address">부산 동구 중앙대로 241번길 7</div>
          <div className="pd-office-desc">
            <h4>운영시간</h4>
            06:00 ~ 21:00
            <h4>좌석수</h4>
            4인용 테이블 5석
            <h4>시설정보</h4>
            와이파이, TV, 휴식공간, 냉난방
          </div>
        </div>
      </div>
    </section>
  );
}
