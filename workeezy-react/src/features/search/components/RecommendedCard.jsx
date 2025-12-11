import "./RecommendedCard.css";

export default function RecommendedCard({ id, title, photo }) {
    return (
        <div className="recommend-card" onClick={onClick}>
            <div
                className="recommend-card-image"
                style={{ backgroundImage: `url(${item.photo})` }}
            >
                <div className="recommend-card-overlay">
                    <div className="recommend-card-title">{item.title}</div>

                </div>
            </div>
        </div>
    );
}
