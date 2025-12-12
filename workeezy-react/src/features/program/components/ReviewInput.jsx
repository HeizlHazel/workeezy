import "./ReviewInput.css"
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../../api/publicApi.js";

export function ReviewInput({ programId, onReviewSubmitted })  {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const navigate = useNavigate();

    // 로그인한 사용자 ID 가져오기
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

                // 입력값 초기화
                setRating(0);
                setReviewText("");

                // 리뷰 게시판으로 이동
                navigate("/reviews");

                // 상세페이지에서 새로고침 등 추가 로직 필요 시
                if (onReviewSubmitted) onReviewSubmitted();
            })
            .catch(err => {
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
