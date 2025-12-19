import { useNavigate } from "react-router-dom";
import "./MapProgramMiniCard.css";

export default function MapProgramMiniCard({ program }) {
    const navigate = useNavigate();
    if (!program) return null;

    const { id, title, photo, price, region } = program;

    const goDetail = (e) => {
        e.preventDefault();
        e.stopPropagation(); // ✅ 지도/말풍선 클릭 전파 차단
        navigate(`/program/${id}`); // ✅ 상세 라우트가 다르면 여기만 수정
    };

    return (
        <button type="button" className="map-mini-card" onClick={goDetail}>
            <img className="map-mini-thumb" src={photo} alt={title} />
            <div className="map-mini-body">
                <div className="map-mini-title">{title}</div>
                <div className="map-mini-meta">
                    <span>{region}</span>
                    {price != null && <span> · {Number(price).toLocaleString()}원~</span>}
                </div>
            </div>
        </button>
    );
}
