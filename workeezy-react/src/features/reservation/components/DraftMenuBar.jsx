import React, { useState, useEffect } from "react";
import "./DraftMenuBar.css";
import axios from "../../../api/axios.js";

export default function DraftMenuBar({
  isAdmin = false,
  isOpen = false,
  onClose,
  latestDraftId,
}) {
  const [openItems, setOpenItems] = useState([]);
  const [draftList, setDraftList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 임시저장 리스트 메뉴 구성
  const userMenu = [
    {
      title: "임시저장 리스트",
      sub: draftList.map((draft) => ({
        key: draft.key,
        name: (
          <>
            {draft.data.title || "제목 없음"}
            {draft.key === latestDraftId && (
              <span className="draft-new-tag"> New!</span>
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

  // 항목 클릭 토글
  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // 임시저장 삭제
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
    <div className={`draft-menu-bar ${isOpen ? "open" : "close"}`}>
      <button className="draft-menu-close-btn" onClick={onClose}>
        ✕
      </button>

      {loading && <p>불러오는 중...</p>}

      {userMenu.map((item, idx) => (
        <div key={idx} className="draft-menu-item">
          <div className="draft-menu-title">{item.title}</div>

          {item.sub && (
            <div className="draft-submenu">
              {item.sub.map((sub) => (
                <div
                  key={sub.key}
                  className={`draft-submenu-item ${
                    openItems.includes(sub.key) ? "selected" : ""
                  }`}
                  onClick={() => toggleItem(sub.key)}
                >
                  {sub.name}
                  <button
                    className="draft-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sub.key);
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
