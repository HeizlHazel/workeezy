import "./SearchCard.css";
import {useNavigate} from 'react-router-dom';
import useImagePath from "../../../hooks/useImagePath.js";

export default function SearchCard({id, title, photo, price }) {
    const navigate = useNavigate();
    const { fixPath } = useImagePath();
    const fixedPhoto = fixPath(photo);
    console.log("S3_BASE", import.meta.env.VITE_S3_BASE_URL);
    console.log("photo raw/fixed", photo, fixedPhoto);


    return (
        <div className="search-card" onClick={() => navigate(`/programs/${id}`)}>
            <div className="search-card-image-wrapper">
                {fixedPhoto ? (
                    <img src={fixedPhoto} alt={title} />
                ) : (
                    <span style={{ color: "#aaa", fontSize: "14px" }}>
                이미지 없음
            </span>
                )}
            </div>

            <div className="search-card-content">
                <div className="search-title">{title}</div>
                <div className="search-price">{price.toLocaleString()}원 / 2박~</div>
            </div>
        </div>

    );
}
