import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProgramReserveBar.css";

export default function ProgramReserveBar({
  rooms = [],
  // office,
  programId,
  // programPrice,
  // programTitle,
  // stayId,
  // stayName,
}) {
  const navigate = useNavigate();

  const [roomId, setRoomType] = useState("");
  // const [officeType, setOfficeType] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const now = useMemo(() => new Date(), []);

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const endOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };

  const [bottomFixed, setBottomFixed] = useState(false);

  // ⭐ 이 placeholder가 화면에 보이는지 감지
  useEffect(() => {
    const placeholder = document.getElementById("reserve-bar-placeholder");

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        setBottomFixed(!isVisible);
      },
      { threshold: 0 }
    );

    if (placeholder) observer.observe(placeholder);
    return () => placeholder && observer.unobserve(placeholder);
  }, []);

  // ✅ 체크인 시간 제한: "선택한 체크인 날짜" 기준으로 min/max 계산
  const inDay = checkIn ?? now;
  const inMinTime =
    startOfDay(inDay).getTime() === startOfDay(now).getTime()
      ? now
      : startOfDay(inDay);
  const inMaxTime = endOfDay(inDay);

  // ✅ 체크아웃 시간 제한:
  // - 체크아웃 날짜가 체크인과 같은 날이면 minTime = checkIn (체크인 이전 시간 막기)
  // - 다른 날이면 minTime = 00:00
  // - maxTime은 "선택된 체크아웃 날짜"의 23:59
  const outDay = checkOut ?? checkIn ?? now;
  const outSameDay =
    !!checkIn &&
    !!outDay &&
    startOfDay(outDay).getTime() === startOfDay(checkIn).getTime();

  const outMinTime = checkIn && outSameDay ? checkIn : startOfDay(outDay);
  const outMaxTime = endOfDay(outDay);

  const onReserve = () => {
    if (!roomId || !checkIn || !checkOut) {
      alert("필수 항목을 입력해주세요!");
      return;
    }
    navigate("/reservation/new", {
      state: {
        programId,
        // programTitle,
        // programPrice,
        roomId,
        // officeId: office.id,
        // officeName: office.name,
        checkIn,
        checkOut,
        // rooms,
        // office: office,
        // stayId,
        // stayName,
      },
    });
  };

  return (
    <>
      {/* ⭐ 화면 감지를 위한 빈 div */}
      <div id="reserve-bar-placeholder" style={{ height: "1px" }}></div>

      {/* ⭐ 실제 예약바 */}
      <div className={`pd-reserve ${bottomFixed ? "bottom-fixed" : ""}`}>
        <div className="pd-reserve-item">
          <label>룸 타입</label>
          <select value={roomId} onChange={(e) => setRoomType(e.target.value)}>
            <option value="">룸 선택</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomType}
              </option>
            ))}
          </select>
        </div>

        {/* 체크인 */}
        <div className="pd-reserve-item">
          <label>체크인</label>
          <div className="pd-input-wrap">
            <i className="fa-regular fa-calendar calendar-icon"></i>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);

                // ✅ 체크인 변경 시 체크아웃이 더 이르면 초기화(보정)
                setCheckOut((prevOut) => {
                  if (!date) return prevOut;
                  if (prevOut && prevOut < date) return null;
                  return prevOut;
                });
              }}
              showTimeSelect
              dateFormat="MM/dd (eee) HH:mm"
              placeholderText="날짜 선택"
              className="pd-datepicker"
              minDate={startOfDay(now)}
              minTime={inMinTime}
              maxTime={inMaxTime}
            />
          </div>
        </div>

        {/* 체크아웃 */}
        <div className="pd-reserve-item">
          <label>체크아웃</label>
          <div className="pd-input-wrap">
            <i className="fa-regular fa-calendar calendar-icon"></i>
            <DatePicker
              selected={checkOut}
              onChange={(date) => {
                if (!date) return;

                // ✅ 같은 날이면 체크인 이전 시간 막기
                if (
                  checkIn &&
                  startOfDay(date).getTime() ===
                    startOfDay(checkIn).getTime() &&
                  date < checkIn
                ) {
                  setCheckOut(checkIn);
                  return;
                }

                setCheckOut(date);
              }}
              showTimeSelect
              dateFormat="MM/dd (eee) HH:mm"
              placeholderText="날짜 선택"
              className="pd-datepicker"
              minDate={checkIn ? startOfDay(checkIn) : startOfDay(now)}
              minTime={outMinTime}
              maxTime={outMaxTime}
            />
          </div>
        </div>

        {/* <div className="pd-reserve-item">
          <label>오피스</label>
          <input
            value={office?.name ?? ""}
            readOnly
            className="pd-input-readonly"
          />
        </div> */}

        <button className="pd-reserve-btn" onClick={onReserve}>
          예약하기
        </button>
      </div>
    </>
  );
}
