import "./ProgramTabs.css";

export default function ProgramTabs() {
    return (
        <div className="pd-tabs">
            <button className="active">프로그램 정보</button>
            <button>숙소 정보</button>
            <button>위치</button>
            <button>문의</button>
            <button>참여하기</button>
        </div>
    );
}
