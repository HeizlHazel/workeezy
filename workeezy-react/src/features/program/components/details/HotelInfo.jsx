import "./HotelInfo.css";

export default function HotelInfo({ info }) {
    if (!info) return null;

    return (
        <section className="pd-section">
            <h3>숙소 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br />

            <div className="pd-hotel-card">
                <img src={info.photo1} className="pd-hotel-img" />
                <div className="pd-hotel-info">
                    <div className="pd-hotel-title">{info.name}</div>
                    <div className="pd-hotel-address">{info.address}</div>
                    <div className="pd-hotel-desc">
                        {info.equipment}
                    </div>
                </div>
            </div>
        </section>
    );
}

