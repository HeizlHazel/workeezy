import "./ActivityInfo.css";

export default function ActivityInfo() {
    return (
        <section className="pd-section">
            <h3>숙소 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br/>

            <div className="pd-Activity-card">
                <img src="/c7209850-7773-481f-af51-511736fcf47d.png" className="pd-Activity-img"/>
                <div className="pd-Activity-info">
                    <div className="pd-Activity-title"><h3>부산 시티투어</h3></div>
                    <div className="pd-Activity-time"><h4>운영시간</h4>09:45 ~ 16:35</div>
                    <div className="pd-Activity-people"><h4>인원</h4>최소 1인 최대 10인</div>
                    <div className="pd-Activity-takeTime"><h4>소요시간</h4>2시간 30분</div>
                </div>
            </div>
        </section>
    );
}
