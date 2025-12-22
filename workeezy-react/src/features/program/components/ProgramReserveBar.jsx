import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProgramReserveBar.css";

export default function ProgramReserveBar({
                                              rooms = [],
                                              offices = [],
                                              programId,
                                              programPrice,
                                              programTitle,
                                              stayId,
                                              stayName,
                                          }) {
    const navigate = useNavigate();

    const [roomType, setRoomType] = useState("");
    const [officeType, setOfficeType] = useState(""); // ✅ offices가 2개 이상일 때만 사용자가 고르는 값
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);

    // ⚠️ now를 고정하면 시간이 지나도 "오늘 최소시간"이 갱신 안 될 수 있어
    // (그래도 너 코드 스타일 유지하고 싶으면 useMemo 유지해도 됨)
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

    // ⭐ 예약바 하단 고정 감지
    useEffect(() => {
        const placeholder = document.getElementById("reserve-bar-placeholder");

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                setBottomFixed(!isVisible);
            },
            {threshold: 0}
        );

        if (placeholder) observer.observe(placeholder);
        return () => placeholder && observer.unobserve(placeholder);
    }, []);

    // ✅ offices가 1개면 강제 선택(파생값), 아니면 사용자가 고른 officeType
    // (useEffect로 setState 하지 않아서 "cascading renders" 경고 안 남)
    const selectedOfficeId =
        offices.length === 1 && offices[0]?.id != null
            ? String(offices[0].id)
            : officeType;

    const officeDisabled = offices.length <= 1;

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
    const outDay = checkOut ?? (checkIn ?? now);
    const outSameDay =
        !!checkIn &&
        !!outDay &&
        startOfDay(outDay).getTime() === startOfDay(checkIn).getTime();

    const outMinTime = checkIn && outSameDay ? checkIn : startOfDay(outDay);
    const outMaxTime = endOfDay(outDay);

    const onReserve = () => {
        if (!roomType || !checkIn || !checkOut) {
            alert("필수 항목을 입력해주세요!");
            return;
        }

        // ✅ offices가 존재하면 선택값 방어 (1개면 selectedOfficeId가 자동 채워짐)
        if (offices.length > 0 && !selectedOfficeId) {
            alert("오피스 타입을 선택해주세요!");
            return;
        }

        navigate("/reservation/new", {
            state: {
                programId,
                programTitle,
                programPrice,
                roomId: roomType,
                officeId: selectedOfficeId, // ✅ 여기 반드시 selectedOfficeId
                checkIn,
                checkOut,
                rooms,
                offices,
                stayId,
                stayName,
            },
        });
    };

    return (
        <>
            <div id="reserve-bar-placeholder" style={{height: "1px"}}></div>

            <div className={`pd-reserve ${bottomFixed ? "bottom-fixed" : ""}`}>
                {/* 룸 타입 */}
                <div className="pd-reserve-item">
                    <label>룸 타입</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                        <option value="">룸 선택</option>
                        {rooms.map((r) => (
                            <option key={r.id} value={String(r.id)}>
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
                                    startOfDay(date).getTime() === startOfDay(checkIn).getTime() &&
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

                {/* 오피스 타입 */}
                <div className="pd-reserve-item">
                    <label>오피스 타입</label>
                    <select
                        value={selectedOfficeId} // ✅ 여기 반드시 selectedOfficeId
                        disabled={officeDisabled}
                        onChange={(e) => setOfficeType(e.target.value)}
                    >
                        {offices.length === 1 ? (
                            <option value={String(offices[0]?.id || "")}>
                                {offices[0]?.name || "오피스"}
                            </option>
                        ) : (
                            <>
                                <option value="">오피스 선택</option>
                                {offices.map((o) => (
                                    <option key={o.id} value={String(o.id)}>
                                        {o.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </div>

                <button className="pd-reserve-btn" onClick={onReserve}>
                    예약하기
                </button>
            </div>
        </>
    );
}
