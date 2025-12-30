import "./ReviewModal.css";
import ReviewInput from "./ReviewInput.jsx";

export default function ReviewModal({ open, onClose, programId, onSubmitted }) {
    if (!open) return null;

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="review-modal-head">
                    <h3>리뷰 작성</h3>
                    <button className="review-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <ReviewInput
                    programId={programId}
                    onSuccess={() => onSubmitted?.()}
                />
            </div>
        </div>
    );
}
