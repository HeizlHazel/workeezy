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
        startOfDay(inDay).getTime() === startOfDay(now).getTime() ? now : startOfDay(inDay);
    const inMaxTime = endOfDay(inDay);

    const outDay = checkOut ?? checkIn ?? now;
    const outSameDay =
        !!checkIn && !!outDay && startOfDay(outDay).getTime() === startOfDay(checkIn).getTime();

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
                        <DatePicker
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
                        />
                    </div>
                </div>

                <div className="pd-reserve-item">
                    <label>체크아웃</label>
                    <div className="pd-input-wrap">
                        <i className="fa-regular fa-calendar calendar-icon" />
                        <DatePicker
                            selected={checkOut}
                            onChange={(date) => {
                                if (!date) return;

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

                <button className="pd-reserve-btn" onClick={onReserve}>
                    예약하기
                </button>
            </div>
        </>
    );
}
