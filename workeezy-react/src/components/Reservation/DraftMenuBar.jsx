import React, { useState, useEffect } from "react";
import "./DraftMenuBar.css";
import axios from "axios";

export default function DraftMenuBar({
  isAdmin = false,
  isOpen = false, // 기본 false 테스트시 ture로
  onClose,
  latestDraftId,
}) {
  const [openItems, setOpenItems] = useState([]); // 펼침 관리
  const [draftList, setDraftList] = useState([]); // ✅ 수정: Redis 임시저장 리스트
  const [loading, setLoading] = useState(false); // ✅ 수정: 로딩 상태

  const userMenu = [
    // { title: "Home" },
    {
      title: "임시저장 목록", // ✅ 수정: Redis 리스트 표시 영역
      sub: draftList.map((draft) => ({
        name: (
          <>
            {draft.title || "제목 없음"}
            {draft.id === latestDraftId && (
              <span className="new-tag"> New!</span> // ✅ New! 표시
            )}
          </>
        ),
        path: "#",
      })),
    },
  ];

  const adminMenu = [
    { title: "관리자 예약 관리" },
    {
      title: "임시저장 목록",
      sub: draftList.map((draft) => ({
        name: (
          <>
            {draft.title || "제목 없음"}
            {draft.id === latestDraftId && (
              <span className="new-tag"> New!</span>
            )}
          </>
        ),
        path: "#",
      })),
    },
  ];

  const menu = isAdmin ? adminMenu : userMenu;

  // ✅ 수정: Redis 임시저장 목록 불러오기
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

  const toggleItem = (title) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className={`menu-bar ${isOpen ? "open" : "close"}`}>
      <button className="menu-close-btn" onClick={onClose}>
        ✕
      </button>

      {loading && <p>불러오는 중...</p>}

      {menu.map((item, idx) => (
        <div key={idx} className="menu-item">
          <div className="menu-title" onClick={() => toggleItem(item.title)}>
            {item.title}
          </div>

          {item.sub && openItems.includes(item.title) && (
            <div className="submenu">
              {item.sub.map((sub, subIdx) => (
                <div key={subIdx} className="submenu-item">
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
