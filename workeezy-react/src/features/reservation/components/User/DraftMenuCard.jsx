import "./DraftMenuCard.css";

export default function DraftMenuCard({
  draft,
  isOpen,
  isNew,
  onToggle,
  onLoad,
  onDelete,
  formatDateTime,
}) {
  const data = draft.data;

  return (
    <div
      className={`draft-card ${isOpen ? "selected" : ""}`}
      onClick={onToggle}
    >
      {/* ===== 헤더 ===== */}
      <div className="draft-card-header">
        <div className="draft-card-title">
          <strong>{data.programTitle || "제목 없음"}</strong>
          {isNew && <span className="draft-new-tag">NEW</span>}
        </div>

        <span className="draft-card-date">
          {data.savedAt
            ? new Date(
                Date.parse(data.savedAt.replace("KST", "GMT+0900"))
              ).toLocaleString()
            : "날짜 없음"}
        </span>

        <button
          className="draft-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ✕
        </button>
      </div>

      {/* ===== 바디 ===== */}
      {isOpen && (
        <div className="draft-card-body">
          <dl className="draft-info">
            <div className="draft-info-row">
              <dt>숙소명</dt>
              <dd>{data.stayName || "-"}</dd>
            </div>

            <div className="draft-info-row">
              <dt>룸타입</dt>
              <dd>{data.roomType || "-"}</dd>
            </div>

            <div className="draft-info-row">
              <dt>오피스</dt>
              <dd>{data.officeName || "-"}</dd>
            </div>

            <div className="draft-info-row">
              <dt>예약일</dt>
              <dd>
                {formatDateTime(data.startDate)} ~{" "}
                {formatDateTime(data.endDate)}
              </dd>
            </div>

            <div className="draft-info-row">
              <dt>인원</dt>
              <dd>{data.peopleCount}명</dd>
            </div>
          </dl>

          <button
            className="draft-load-btn"
            onClick={(e) => {
              e.stopPropagation();
              onLoad();
            }}
          >
            불러오기 →
          </button>
        </div>
      )}
    </div>
  );
}
