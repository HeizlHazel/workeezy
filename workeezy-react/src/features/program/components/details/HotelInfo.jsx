import "./HotelInfo.css";

export default function HotelInfo({ hotel }) {
    if (!hotel) return null;
    const getImage = (url) => {
        if (!url) return "";
        return url.startsWith("public/")
            ? "/" + url.replace("public/", "")
            : url;
    };


    return (
        <section className="pd-section">
            <h3>숙소 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br />

            <div className="pd-hotel-card">
                <img src={getImage(hotel.photo1)} className="pd-hotel-img" />
                <div className="pd-hotel-info">
                    <div className="pd-hotel-title">{hotel.name}</div>
                    <div className="pd-hotel-address">{hotel.address}</div>
                    <div className="pd-hotel-desc">
                        {hotel.equipment}
                    </div>
                </div>
            </div>
        </section>
    );
}

