// ReviewInput.jsx
import "./ReviewInput.css";
import { useState } from "react";
import api from "../../../api/axios.js";
import Swal from "sweetalert2";

export default function ReviewInput({ programId, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const handleSubmit = async () => {
        if (!programId) {
            return Swal.fire({ icon: "warning", title: "프로그램 정보가 없어요.", timer: 1500, showConfirmButton: false });
        }
        if (!rating) {
            return Swal.fire({ icon: "warning", title: "별점을 선택해주세요!", timer: 1500, showConfirmButton: false });
        }
        if (!reviewText.trim()) {
            return Swal.fire({ icon: "warning", title: "리뷰 내용을 입력해주세요!", timer: 1500, showConfirmButton: false });
        }

        try {
            await api.post("/api/reviews", {
                programId: Number(programId),
                rating: Number(rating),
                reviewText: reviewText.trim(),
            });

            setRating(0);
            setReviewText("");

            // ✅ 성공 처리(모달 닫기/토스트/이동)는 부모에서
            onSuccess?.();
        } catch (err) {
            console.error("리뷰 등록 실패:", err);
            Swal.fire({
                icon: "error",
                title: "리뷰 등록 실패",
                text: err?.response?.data?.message ?? "잠시 후 다시 시도해주세요.",
            });
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
