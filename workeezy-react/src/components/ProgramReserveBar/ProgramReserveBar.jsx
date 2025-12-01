import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProgramReserveBar.css";

export default function ProgramReserveBar() {

    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);

    return (
        <div className="pd-reserve">

            {/* 룸 타입 */}
            <div className="pd-reserve-item">
                <label>룸 타입</label>
                <select>
                    <option>스탠다드</option>
                    <option>디럭스</option>
                    <option>패밀리</option>
                    <option>스위트</option>
                </select>
            </div>

            {/* 체크인 */}
            <div className="pd-reserve-item">
                <label>체크인</label>
                <div className="pd-input-wrap">
                    <span className="icon">📅</span>

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
                <div className="pd-input-wrap">
                    <span className="icon">📅</span>

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
                <select>
                    <option>부산 워케이션 거점센터</option>
                    <option>서울 강남 거점센터</option>
                    <option>제주 워케이션 센터</option>
                    <option>대구 워케이션 센터</option>
                </select>
            </div>

            <button className="pd-reserve-btn">예약하기</button>
        </div>
    );
}
