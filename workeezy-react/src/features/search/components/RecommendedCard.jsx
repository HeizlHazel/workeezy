import "./RecommendedCard.css";

export default function RecommendedCard({ id, title, photo, price, region, onClick }) {
    return (
        <div className="recommend-card" onClick={onClick}>
            <div
                className="recommend-card-image"
                style={{ backgroundImage: `url(${photo})` }}
            >
                <div className="recommend-card-overlay">
                    <div className="recommend-card-title">{title}</div>

                    {region && (
                        <div className="recommend-card-region">
                            {region}
                        </div>
                    )}

                    {price != null && (
                        <div className="recommend-card-price">
                            {price.toLocaleString()}원~
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
