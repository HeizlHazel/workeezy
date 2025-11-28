import "./ProgramReserveBar.css";

export default function ProgramReserveBar() {
    return (
        <div className="pd-reserve">
            <div className="pd-reserve-item">
                <label>체크인</label>
                <input type="date"/>
            </div>
            <div className="pd-reserve-item">
                <label>체크아웃</label>
                <input type="date"/>
            </div>
            <button className="pd-reserve-btn">예약하기</button>
        </div>
    );
}
