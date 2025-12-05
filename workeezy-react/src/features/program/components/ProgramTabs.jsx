import "./ProgramTabs.css";

export default function ProgramTabs() {
    return (
        <div className="pd-tabs">
            <button className="active">프로그램 정보</button>
            <button>숙소 정보</button>
            <button>오피스</button>
            <button>액티비티</button>
            <button>참여후기</button>
        </div>
    );
}
