import "./ReviewInput.css";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../../api/publicApi.js";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";

export default function ReviewInput({ onReviewSubmitted }) {
    const { programId } = useProgramDetail();

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const navigate = useNavigate();

    let userId = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
    }

    const handleSubmit = () => {
        if (!rating) {
            alert("별점을 선택해주세요!");
            return;
        }
        if (!reviewText.trim()) {
            alert("리뷰 내용을 입력해주세요!");
            return;
        }

        publicApi
            .post("/api/reviews", {
                programId,
                userId,
                rating,
                reviewText,
            })
            .then(() => {
                alert("리뷰가 등록되었습니다!");
                setRating(0);
                setReviewText("");
                navigate("/reviews");
                if (onReviewSubmitted) onReviewSubmitted();
            })
            .catch((err) => {
                console.error("리뷰 등록 실패:", err);
            });
    };

    return (
        <div className="review-write-box">
            <div className="rating-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? "star filled" : "star"}
                        onClick={() => setRating(star)}
                    >
            ★
          </span>
                ))}
            </div>

            <textarea
                className="review-input"
                placeholder="리뷰를 입력해주세요"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />

            <button className="submit-review-btn" onClick={handleSubmit}>
                리뷰 등록하기
            </button>
        </div>
    );
}
