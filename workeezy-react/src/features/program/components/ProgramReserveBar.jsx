import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProgramReserveBar.css";

export default function ProgramReserveBar({ rooms = [], offices = [], programId }) {

    const navigate = useNavigate();

    const [roomType, setRoomType] = useState("");
    const [officeType, setOfficeType] = useState("");
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);


    const onReserve = () => {

        if (!roomType || !checkIn || !checkOut) {
            alert("필수 항목을 입력해주세요!");
            return;
        }

        navigate("/reserve", {
            state: {
                programId,
                roomId: roomType,
                officeId: officeType,
                checkIn,
                checkOut
            }
        });
    };

    return (
        <div className="pd-reserve">

            {/* 룸 타입 */}
            <div className="pd-reserve-item">
                <label>룸 타입</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
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
                <div className="pd-input-wrap date-wrap">
                    <i className="fa-regular fa-calendar calendar-icon"></i>
                    <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        showTimeSelect
                        dateFormat="MM/dd (eee) HH:mm"
                        placeholderText="날짜 선택"
                        className="pd-datepicker"
                    />
                </div>
            </div>


            {/* 체크아웃 */}
            <div className="pd-reserve-item">
                <label>체크아웃</label>
                <div className="pd-input-wrap date-wrap">
                    <i className="fa-regular fa-calendar calendar-icon"></i>
                    <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        showTimeSelect
                        dateFormat="MM/dd (eee) HH:mm"
                        placeholderText="날짜 선택"
                        className="pd-datepicker"
                    />
                </div>
            </div>



            {/* 오피스 타입 */}
            <div className="pd-reserve-item">
                <label>오피스 타입</label>
                <select value={officeType} onChange={(e) => setOfficeType(e.target.value)}>
                    <option value="">오피스 선택</option>
                    {offices.map((o) => (
                        <option key={o.id} value={o.id}>
                            {o.name}
                        </option>
                    ))}
                </select>
            </div>

            <button className="pd-reserve-btn" onClick={onReserve}>
                예약하기
            </button>
        </div>
    );
}
