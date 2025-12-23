import "./ReviewInput.css";
import { jwtDecode } from "jwt-decode";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../../api/publicApi.js";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";

function parseJwtPayloadFromStorage() {
    const raw = localStorage.getItem("accessToken");
    if (!raw) return null;

    // 1) "Bearer xxx" 형태면 Bearer 제거
    const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;

    // 2) JWT는 반드시 3파트
    if (token.split(".").length !== 3) return null;

    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}

export default function ReviewInput({ onReviewSubmitted }) {
    const { programId } = useProgramDetail();

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const navigate = useNavigate();

    // ✅ 렌더 중 크래시 방지 + 값 캐싱
    const payload = useMemo(() => parseJwtPayloadFromStorage(), []);
    const userId = payload?.userId ?? null;

    const handleSubmit = async () => {
        // ✅ 로그인 체크
        if (!userId) {
            alert("로그인이 필요합니다.");
            navigate("/login"); // 너 프로젝트 로그인 라우트에 맞게 수정
            return;
        }

        if (!rating) {
            alert("별점을 선택해주세요!");
            return;
        }
        if (!reviewText.trim()) {
            alert("리뷰 내용을 입력해주세요!");
            return;
        }

        try {
            await publicApi.post("/api/reviews", {
                programId,
                userId,
                rating,
                reviewText,
            });

            alert("리뷰가 등록되었습니다!");
            setRating(0);
            setReviewText("");
            navigate("/reviews");
            onReviewSubmitted?.();
        } catch (err) {
            console.error("리뷰 등록 실패:", err);

            // ✅ 401/403이면 토큰 문제 가능성이 큼
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                alert("인증 정보가 유효하지 않습니다. 다시 로그인해주세요.");
                localStorage.removeItem("accessToken");
                navigate("/login"); // 로그인 라우트에 맞게
            } else {
                alert("리뷰 등록에 실패했습니다.");
            }
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
