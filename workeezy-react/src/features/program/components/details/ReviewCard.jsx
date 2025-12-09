import "./ReviewCard.css";
import { useNavigate } from "react-router-dom";

export default function ReviewCard({ image, rating, programName, reviewText, programId }) {

    const navigate = useNavigate();

    const goDetail = () => {
        if (!programId) {
            console.warn("❗ ReviewCard: programId가 없습니다.");
            return;
        }
        navigate(`/programs/${programId}`);
    };

    return (
        <div className="review-card" onClick={goDetail}>
            <img src={image} alt={programName} />

            <div className="review-card-content">

                {/* ⭐ 상단 별점 */}
                <div className="review-stars">
                    {"★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating)}
                </div>

                {/* ⭐ 프로그램명 */}
                <div className="review-program-name">
                    {programName}
                </div>

                {/* ⭐ 리뷰 텍스트 */}
                <div className="review-text">
                    {reviewText}
                </div>

            </div>
        </div>
    );
}
