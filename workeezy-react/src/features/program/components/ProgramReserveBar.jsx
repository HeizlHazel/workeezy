import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProgramReserveBar.css";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";

export default function ProgramReserveBar() {
  const navigate = useNavigate();
  const { programId, rooms } = useProgramDetail();

  const [roomId, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // 예약 가능 여부
  const [isAvailable, setIsAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const STAY_DAYS = 2; // 2박 3일

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    if (!roomId || !checkIn || !checkOut) return;

    const checkAvailability = async () => {
      try {
        setChecking(true);
        const res = await fetch(
          `/api/reservations/availability?roomId=${roomId}&startDate=${checkIn.toISOString()}&endDate=${checkOut.toISOString()}`
        );
        const data = await res.json();
        setIsAvailable(Boolean(data.available));
      } catch (e) {
        setIsAvailable(false);
      } finally {
        setChecking(false);
      }
    };

    checkAvailability();
  }, [roomId, checkIn, checkOut]);

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

  const inDay = checkIn ?? now;
  const inMinTime =
    startOfDay(inDay).getTime() === startOfDay(now).getTime()
      ? now
      : startOfDay(inDay);
  const inMaxTime = endOfDay(inDay);

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
        roomId,
        checkIn,
        checkOut,
      },
    });
  };

  // 체크인 선택시 자동으로 체크아웃 계산
  const handleCheckInChange = (date) => {
    if (!date) return;

    setCheckIn(date);

    const checkOut = new Date(date);
    checkOut.setDate(checkOut.getDate() + STAY_DAYS);
    setCheckOut(checkOut);
  };

  return (
    <>
      <div id="reserve-bar-placeholder" style={{ height: "1px" }} />

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
        <div className="pd-reserve-item">
          <label>체크인</label>
          <div className="pd-input-wrap">
            <i className="fa-regular fa-calendar calendar-icon" />
            {/* <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
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
            /> */}
            <DatePicker
              className="pd-datepicker"
              showTimeSelect
              selected={checkIn}
              onChange={handleCheckInChange}
              minDate={startOfDay(now)}
              dateFormat="MM/dd (eee) HH:mm"
              placeholderText="체크인 날짜"
            />
          </div>
        </div>
        {/* <div className="pd-reserve-item">
          <label>체크아웃</label>
          <div className="pd-input-wrap">
            <i className="fa-regular fa-calendar calendar-icon" />
            <DatePicker
              selected={checkOut}
              onChange={(date) => {
                if (!date) return;

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
        </div> */}

        <div className="availability-status">
          {checking && <span className="checking">확인 중...</span>}

          {!checking && isAvailable === true && (
            <span className="ok">예약 가능</span>
          )}

          {!checking && isAvailable === false && (
            <span className="fail">예약 불가</span>
          )}
        </div>

        <div className="pd-reserve-item">
          <label>체크아웃</label>
          {/* <input
            showTimeSelect
            dateFormat="MM/dd (eee) HH:mm"
            type="text"
            className="pd-readonly"
            value={checkOut ? checkOut.toLocaleDateString() : ""}
            readOnly
          /> */}
          <DatePicker
            selected={checkOut}
            showTimeSelect
            dateFormat="MM/dd (eee) HH:mm"
            readOnly
            disabled
            className="pd-datepicker"
          />
        </div>
        <button
          className="pd-reserve-btn"
          disabled={!isAvailable || checking}
          onClick={onReserve}
        >
          {checking ? "확인 중..." : "예약하기"}
        </button>
      </div>
    </>
  );
}
