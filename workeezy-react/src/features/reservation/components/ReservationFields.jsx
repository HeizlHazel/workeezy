import "./ReservationFields.css";

export default function ReservationFields({
  userName,
  company,
  phone,
  email,
  startDate,
  endDate,
  office,
  roomType,
  peopleCount,
  onChange,
}) {
  return (
    <>
      {/* 신청자명 */}
      <div className="user-name">
        <div className="div">신청자명</div>
        <div className="input">
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={onChange}
            placeholder="이름을 입력하세요"
            className="value"
          />
        </div>
      </div>

      {/* 소속 */}
      <div className="user-company">
        <div className="div">소속</div>
        <div className="input">
          <input
            type="text"
            name="company"
            value={company}
            onChange={onChange}
            placeholder="소속을 입력하세요"
            className="value"
          />
        </div>
      </div>

      {/* 연락처 */}
      <div className="user-phone">
        <div className="div">연락처</div>
        <div className="input">
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={onChange}
            placeholder="010-0000-0000"
            className="value"
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className="user-mail">
        <div className="div">이메일</div>
        <div className="input">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="example@email.com"
            className="value"
          />
        </div>
      </div>

      {/* 예약 날짜 */}
      <div className="res-date">
        <div className="div">예약 날짜</div>
        <div className="date">
          <div className="started-at">
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={onChange}
              className="input-text"
            />
          </div>
          <div className="ended-at">
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={onChange}
              className="input-text"
            />
          </div>
        </div>
      </div>

      {/* 오피스 */}
      <div className="office">
        <div className="div">오피스</div>
        <div className="input">
          <input
            type="text"
            name="office"
            value={office}
            onChange={onChange}
            placeholder="오피스명을 입력하세요"
            className="value"
          />
        </div>
      </div>

      {/* 룸타입 */}
      <div className="roomtype">
        <div className="div">룸타입</div>
        <div className="input">
          <input
            type="text"
            name="roomType"
            value={roomType}
            onChange={onChange}
            placeholder="룸 타입을 입력하세요"
            className="value"
          />
        </div>
      </div>

      {/* 인원 */}
      <div className="people-count">
        <div className="div">인원</div>
        <div className="input">
          <input
            type="number"
            name="peopleCount"
            value={peopleCount}
            onChange={onChange}
            min="1"
            placeholder="0"
            className="value"
          />
        </div>
      </div>
    </>
  );
}
