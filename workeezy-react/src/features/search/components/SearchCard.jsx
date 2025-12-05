import "./SearchCard.css";
import {useNavigate} from 'react-router-dom';

export default function SearchCard({id, title, photo, price }) {
    const navigate = useNavigate();
    return (
        <div className="search-card">
            <div className="search-card-image-wrapper">
                {photo ? (
                    <img src={photo} alt={title} />
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
