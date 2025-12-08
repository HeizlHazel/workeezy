import React, { useState, useEffect } from "react";
import "./DraftMenuBar.css";
import axios from "../../../api/axios.js";

export default function DraftMenuBar({
  isAdmin = false,
  isOpen = false, // 기본 false 테스트시 ture로
  onClose,
  latestDraftId,
}) {
  const [openItems, setOpenItems] = useState([]); // 펼침 관리
  const [draftList, setDraftList] = useState([]); // Redis 임시저장 리스트
  const [loading, setLoading] = useState(false); // 수정: 로딩 상태

  // 임시저장 리스트 메뉴
  const userMenu = [
    {
      title: "임시저장 리스트",
      sub: draftList.map((draft) => ({
        key: draft.key,
        name: (
          <>
            {draft.data.title || "제목 없음"}
            {draft.key === latestDraftId && (
              <span className="new-tag"> New!</span>
            )}
          </>
        ),
      })),
    },
  ];

  // Redis 임시저장 목록 불러오기
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setLoading(true);
    axios
      .get("http://localhost:8080/api/reservations/draft/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDraftList(res.data || []))
      .catch((err) => console.error("임시저장 목록 불러오기 실패", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleDelete = async (draftKey) => {
    if (!window.confirm("이 임시저장을 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(
        `http://localhost:8080/api/reservations/draft/${encodeURIComponent(
          draftKey
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDraftList((prev) =>
        prev.filter((d) => d.key !== decodeURIComponent(draftKey))
      );
      alert("삭제 완료!");
    } catch (err) {
      console.error("임시저장 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={`menu-bar ${isOpen ? "open" : "close"}`}>
      <button className="menu-close-btn" onClick={onClose}>
        ✕
      </button>

      {loading && <p>불러오는 중...</p>}

      {userMenu.map((item, idx) => (
        <div key={idx} className="menu-item">
          <div className="menu-title">{item.title}</div>

          {/* 서브 목록에서 id 기준으로 토글 */}
          {item.sub && (
            <div className="submenu">
              {item.sub.map((sub) => (
                <div
                  key={sub.key}
                  className="submenu-item"
                  onClick={() => toggleItem(sub.key)}
                >
                  {sub.name}
                  {/* 삭제 버튼 */}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 onClick 방지
                      handleDelete(sub.key);
                    }}
                  >
                    X
                  </button>

                  {openItems.includes(sub.key) && (
                    <span className="open-indicator"> ▼</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
