import "./HotelInfo.css";

export default function HotelInfo() {
    return (
        <section className="pd-section">
            <h3>숙소 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br/>

            <div className="pd-hotel-card">
                <img src="/c7209850-7773-481f-af51-511736fcf47d.png" className="pd-hotel-img"/>
                <div className="pd-hotel-info">
                    <div className="pd-hotel-title">토요코 인 부산역</div>
                    <div className="pd-hotel-address">부산 동구 중앙대로 101길 12</div>
                    <div className="pd-hotel-desc">
                        체크인 16:00 / 체크아웃 10:00<br/>
                        와이파이 · TV · 냉장고 · 욕실용품
                    </div>
                </div>
            </div>
        </section>
    );
}
