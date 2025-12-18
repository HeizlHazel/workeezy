import "./ReservationActions.css";

export default function ReservationActions({ onOpenDraft, isEdit = false }) {
  return (
    //  form의 onSubmit을 자동으로 실행
    <div className="submit-button">
      <button type="submit" className="button2">
        <div className="div2">신청하기</div>
      </button>

      {!isEdit && (
        <button type="button" className="button3" onClick={onOpenDraft}>
          <div className="div3">임시저장함</div>
        </button>
      )}
    </div>
  );
}
