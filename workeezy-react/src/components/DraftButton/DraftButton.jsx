import "./DraftButton.css";

export default function DraftButton() {
  return (
    <div className="save-draft-button">
      {/* 기존 .button 스타일 유지 */}
      <button type="button" className="button">
        임시저장
      </button>
    </div>
  );
}
