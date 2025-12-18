import React, { useState, useEffect } from "react";
import "./DraftMenuBar.css";
import axios from "../../../../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function DraftMenuBar({
  isOpen = false, // 열림-닫힘 상태
  onClose, // 닫기 함수
  latestDraftId, // 최근 저장된 draft id
}) {
  const [openItems, setOpenItems] = useState([]);
  const [draftList, setDraftList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 임시저장 리스트 메뉴 구성
  const userMenu = [
    {
      title: "임시저장 리스트",
      // useEffect-setDraftList
      sub: draftList.map((draft) => ({
        key: draft.key,
        data: draft.data,
        savedAt: draft.data?.savedAt,
      })),
    },
  ];

  // Redis 임시저장 목록 불러오기
  useEffect(() => {
    // 메뉴가 닫혀 있으면 불러오기 시도 x
    if (!isOpen) return;
    const token = localStorage.getItem("accessToken");
    // 토큰이 없으면 불러오기 시도 x
    if (!token) return;
    setLoading(true);
    // 실제 걸리는 시간동안 Loading 화면

    axios
      .get("http://localhost:8080/api/reservations/draft/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDraftList(res.data || []))
      .catch((err) => console.error("임시저장 목록 불러오기 실패", err))
      .finally(() => setLoading(false));
  }, [isOpen]); //

  // ✅ 임시저장 불러오기
  const handleLoadDraft = async (draftKey) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      // 1️⃣ draft 데이터 불러오기
      const res = await axios.get(
        `http://localhost:8080/api/reservations/draft/${draftKey}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const draftData = res.data;

      // 2️⃣ 필드 통일
      const normalizedDraft = {
        ...draftData,
        // 오피스명 / 장소명
        officeName: draftData.officeName || draftData.placeName || "",
        // 룸타입 / 룸이름
        roomType: draftData.roomType || draftData.roomName || "",
        // 오피스 ID (placeId가 있을 수도 있음)
        officeId: draftData.officeId || draftData.placeId || "",
        // 룸 ID
        roomId: draftData.roomId || "",
        // 숙소
        stayId: draftData.stayId || "",
        stayName: draftData.stayName || draftData.hotelName || "",
      };

      // ✅ 3️⃣ (수정) 더 이상 API 요청 안 함 — draft 안에 있는 rooms/offices 사용
      const rooms = draftData.rooms || [];
      const offices = draftData.offices || [];

      // 4️⃣ ReservationForm으로 이동
      alert("임시저장을 불러왔습니다!");
      navigate("/reservation/new", {
        state: {
          ...normalizedDraft,
          rooms,
          offices,
        },
      });
    } catch (err) {
      console.error("임시저장 불러오기 실패:", err);
      alert("불러오기 중 오류가 발생했습니다.");
    }
  };

  // 하나만 선택되게
  const toggleItem = (id) => {
    setOpenItems((prev) => (prev[0] === id ? [] : [id]));
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
                  className={`draft-card ${
                    openItems.includes(sub.key) ? "selected" : ""
                  }`}
                  onClick={() => toggleItem(sub.key)}
                >
                  <div className="draft-card-header">
                    <div className="draft-card-title">
                      <strong>{sub.data.programTitle || "제목 없음"}</strong>
                      {sub.key === latestDraftId && (
                        <span className="draft-new-tag">NEW</span>
                      )}
                    </div>
                    <span className="draft-card-date">
                      {sub.data.savedAt
                        ? new Date(
                            Date.parse(
                              sub.data.savedAt.replace("KST", "GMT+0900")
                            )
                          ).toLocaleString()
                        : "날짜 없음"}
                    </span>
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

                  {/* 상세정보 (토글 시 표시) */}
                  {openItems.includes(sub.key) && (
                    <div className="draft-card-body">
                      <p>숙소명 : {sub.data.stayName || sub.data.stayName}</p>
                      <p>룸타입 : {sub.data.roomType || sub.data.roomType}</p>

                      <p>
                        📅 {sub.data.startDate} ~ {sub.data.endDate}
                      </p>
                      <p>👥 인원: {sub.data.peopleCount}명</p>
                      <button
                        className="draft-load-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadDraft(sub.key);
                        }}
                      >
                        불러오기 →
                      </button>
                    </div>
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
