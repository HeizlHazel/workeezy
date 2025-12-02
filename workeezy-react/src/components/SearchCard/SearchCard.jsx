import "./SearchCard.css";

export default function SearchCard({ title, desc, photo, price }) {
    return (
        <div className="search-card">
            <img src={photo} alt={title} />
            <div className="search-card-content">
                <div className="search-title">{title}</div>
                <div className="search-desc">{desc}</div>
                <div className="search-price">{price.toLocaleString()}원 / 2박 ~</div>
            </div>
        </div>
    );
}
