import "./ActivityInfo.css";
import { useProgramDetail } from "../../context/ProgramDetailContext.jsx";
import useImagePath from "../../hooks/useImagePath.js";

export default function ActivityInfo() {
    const { attractions } = useProgramDetail();
    const { fixPath } = useImagePath();

    if (!attractions || attractions.length === 0) return null;

    return (
        <section className="pd-section">
            <h3>액티비티 정보</h3>
            <hr style={{ border: 0, borderTop: "1px solid #eeeeee" }} />
            <br />

            {attractions.map((a) => (
                <div key={a.id} className="pd-Activity-card">
                    <img src={fixPath(a.photo1) ?? ""} className="pd-Activity-img" />

                    <div className="pd-Activity-info">
                        <div className="pd-Activity-title">
                            <h3>{a.name}</h3>
                        </div>

                        <div className="pd-Activity-time">{a.equipment}</div>

                        {a.attractionUrl && (
                            <a href={a.attractionUrl} target="_blank" rel="noreferrer">
                                자세히 보기
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
}
