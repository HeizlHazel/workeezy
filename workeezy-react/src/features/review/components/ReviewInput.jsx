import "./ReviewInput.css";
import { useState } from "react";
import publicApi from "../../../api/publicApi.js";

export default function ReviewInput({ programId, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const handleSubmit = async () => {
        if (!programId) return alert("프로그램 정보가 없어요.");
        if (!rating) return alert("별점을 선택해주세요!");
        if (!reviewText.trim()) return alert("리뷰 내용을 입력해주세요!");

        try {
            await publicApi.post("/api/reviews", { programId, rating, reviewText });
            alert("리뷰가 등록되었습니다!");
            setRating(0);
            setReviewText("");
            onSuccess?.();
        } catch (err) {
            console.error("리뷰 등록 실패:", err);
            alert("리뷰 등록 실패");
        }
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
