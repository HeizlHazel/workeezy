import "./DraftButton.css";

export default function DraftButton({ onClick }) {
  return (
    <div className="save-draft-button">
      {/* 기존 .button 스타일 유지 */}
      <button type="button" className="button" onClick={onClick}>
        임시저장
      </button>
    </div>
  );
}
