import "./SearchCard.css";
import {useNavigate} from 'react-router-dom';

export default function SearchCard({id, title, photo, price }) {
    const navigate = useNavigate();
    return (
        <div className="search-card" onClick={()=>navigate(`/programs/${id}`)}>
            <img src={photo} alt={title} />
            <div className="search-card-content">
                <div className="search-title">{title}</div>
                <div className="search-price">{price.toLocaleString()}원 / 2박 ~</div>
            </div>
        </div>
    );
}
