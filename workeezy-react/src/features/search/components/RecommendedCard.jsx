import "./RecommendedCard.css";
import { useNavigate } from "react-router-dom";
import useImagePath from "../../../hooks/useImagePath.js";

export default function RecommendedCard({ id, title, photo, price, region, onClick }) {
    const navigate = useNavigate();
    const { fixPath } = useImagePath();
    const fixedPhoto = fixPath(photo);

    const handleClick = () => {
        if (onClick) return onClick();
        if (id != null) navigate(`/programs/${id}`);
    };

    return (
        <div className="recommend-card" onClick={handleClick}>
            <div
                className="recommend-card-image"
                style={{
                    backgroundImage: fixedPhoto ? `url("${fixedPhoto}")` : "none",
                }}
            >
                {!fixedPhoto && (
                    <div className="recommend-card-noimg">이미지 없음</div>
                )}

                <div className="recommend-card-overlay">
                    <div className="recommend-card-title">{title}</div>
                    {region && <div className="recommend-card-region">{region}</div>}
                    {price != null && (
                        <div className="recommend-card-price">{price.toLocaleString()}원~</div>
                    )}
                </div>
            </div>
        </div>
    );
}
