import "./ReviewCard.css";

export default function ReviewCard({ title, desc, image, rating }) {
    return (
        <div className="review-card">
            <img src={image} alt={title} />
            <div className="review-card-content">

                {/* 제목 + 별점 한 줄 */}
                <div className="review-header-row">
                    <div className="review-title">{title}</div>
                    <div className="review-stars">
                        {"★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating)}
                    </div>
                </div>

                <div className="review-desc">{desc}</div>
            </div>
        </div>
    );
}
