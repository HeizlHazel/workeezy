import "./HotelInfo.css";
import { useProgramDetail } from "../../context/ProgramDetailContext.jsx";
import useImagePath from "../../../../hooks/useImagePath.js";

export default function HotelInfo() {
    const { hotel } = useProgramDetail();
    const { fixPath } = useImagePath();

    if (!hotel) return null;

    return (
        <section className="pd-section">
            <h3>숙소 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br />

            <div className="pd-hotel-card">
                <img src={fixPath(hotel.photo1) ?? ""} className="pd-hotel-img" />
                <div className="pd-hotel-info">
                    <div className="pd-hotel-title">{hotel.name}</div>
                    <div className="pd-hotel-address">{hotel.address}</div>
                    <div className="pd-hotel-desc">{hotel.equipment}</div>
                </div>
            </div>
        </section>
    );
}
