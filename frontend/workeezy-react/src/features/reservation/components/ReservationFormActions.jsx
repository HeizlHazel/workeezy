import "./ReservationFormActions.css";

export default function ReservationFormActions({ onOpenDraft, mode }) {
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isResubmit = mode === "resubmit";

  const getButtonText = () => {
    if (isEdit) return "수정하기";
    if (isResubmit) return "재신청하기";
    return "신청하기";
  };

  return (
    //  form의 onSubmit을 자동으로 실행
    <div className="submit-button">
      <button type="submit" className="button2">
        <div className="div2">{getButtonText()}</div>
      </button>

      {isCreate && (
        <button type="button" className="button3" onClick={onOpenDraft}>
          <div className="div3">임시저장함</div>
        </button>
      )}
    </div>
  );
}
