import { useEffect, useState } from "react";
import ReservationFields from "./ReservationFields.jsx";
import DraftButton from "./DraftButton.jsx";
import SubmitButton from "./SubmitButton.jsx";
import "./ReservationForm.css";
import axios from "../../../api/axios.js";
import DraftMenuBar from "./DraftMenuBar";
// import { useLocation } from "react-router-dom"; // 부모 reserveBar의 state로 전달된 값 받을 용도

export default function ReservationForm({
  initialData,
  rooms = [],
  offices = [],
}) {
  // const location = useLocation();
  // const { state } = location || {};
  // const { programId, roomId, officeId, checkIn, checkOut } = state || {};
  const { programId, roomId, officeId, checkIn, checkOut } = initialData || {};

  const selectedRoom = rooms.find((r) => r.id === Number(roomId));
  const selectedOffice = offices.find((o) => o.id === Number(officeId));

  // -------------------------------------------------------------------
  // * form 기본 상태 관리 (예약 폼 초기값)
  // -------------------------------------------------------------------
  const [form, setForm] = useState({
    programId: programId || "",
    programTitle: "",
    userName: "",
    company: "",
    phone: "",
    email: "",
    startDate: checkIn ? new Date(checkIn).toISOString().slice(0, 10) : "",
    endDate: checkOut ? new Date(checkOut).toISOString().slice(0, 10) : "",
    placeName: selectedOffice?.name || "", // 화면 표시용 이름
    roomType: selectedRoom?.roomType || "", // 화면 표시용 이름
    peopleCount: 1,
  });

  // -------------------------------------------------------------------
  // * 임시저장 관련 (Draft) *
  // -------------------------------------------------------------------
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false); // 메뉴바 열림 - 닫힘
  const [latestDraftId, setLatestDraftId] = useState(null); // 최근 저장된 draft 식별용 (New!)

  // -------------------------------------------------------------------
  // 1. 초기데이터 반영
  // 2. state가 있으면 신규 예약 폼 초기화 : 기존 값 끼워넣기
  // -------------------------------------------------------------------

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setForm((prev) => ({
        ...prev,
        programId: initialData.programId || prev.programId,
        startDate: initialData.checkIn
          ? new Date(initialData.checkIn).toISOString().slice(0, 10)
          : prev.startDate,
        endDate: initialData.checkOut
          ? new Date(initialData.checkOut).toISOString().slice(0, 10)
          : prev.endDate,
        placeName: initialData.officeName || prev.placeName,
        roomType: initialData.roomType || prev.roomType,
        programTitle: initialData.programTitle || prev.programTitle,
      }));
    }
  }, [initialData]);

  // -------------------------------------------------------------------
  // 사용자 정보 자동 채우기 (localStorage에서 가져오기)
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8080/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        // localStorage에 저장 (다음번 자동 완성용)
        localStorage.setItem("user", JSON.stringify(userData));

        // form 자동 채우기
        setForm((prev) => ({
          ...prev,
          userName: userData.name || userData.userName || prev.userName,
          company: userData.company || prev.company,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
        }));
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    fetchUser();
  }, []);

  // -------------------------------------------------------------------
  // 입력 변경 핸들러 (Form의 모든 Field에 적용)
  // -------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  console.log("📤 전송할 form 데이터:", form);

  // -------------------------------------------------------------------
  // 예약 신청 및 수정 처리
  // -------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // 브라우저 자동 새로고침 막기
    const token = localStorage.getItem("accessToken");

    try {
      if (initialData && initialData.id) {
        console.log("🧾 initialData:", initialData);
        // PUT : 예약 수정 (기존 예약 업데이트)
        await axios.put(
          `http://localhost:8080/api/reservations/${initialData.id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert("예약이 성공적으로 수정 되었습니다!");
      } else {
        // POST : 신규 예약 등록
        await axios.post(
          "http://localhost:8080/api/reservations",
          {
            ...form,
            roomId: initialData.roomId, // DB용 id
            officeId: initialData.officeId, // DB용 id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert("예약이 성공적으로 등록되었습니다!");
      }
    } catch (error) {
      console.error("예약 전송 실패", error);
      alert("예약 처리 중 오류가 발생했습니다.");
    }
  };

  // -------------------------------------------------------------------
  // 임시 저장
  // -------------------------------------------------------------------
  const handleDraftSave = async () => {
    const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 JWT 토큰

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    // 워케이션 명을 draft 제목으로 지정
    const draftData = {
      ...form,
      title: form.programTitle,
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/api/reservations/draft/me",
        draftData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 전달
          },
        }
      );

      // 방금 저장된 draft ID 저장 (New! 표시용)
      setLatestDraftId(res.data.id || Date.now());
      // 저장 후 메뉴 자동 열기
      setIsDraftMenuOpen(true);

      alert("임시저장 완료!");
    } catch (error) {
      console.error("임시저장 실패", error);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  // 임시 저장 불러오기
  // 불러오기 기능은 DraftMenuBar 내부에서 실행됨 (props 통해 연결)

  // UI 렌더링
  return (
    <div className="form">
      <form className="reservation-form" onSubmit={handleSubmit}>
        {/* 입력 필드 그룹 */}
        <ReservationFields
          {...form}
          rooms={rooms}
          offices={offices}
          onChange={handleChange}
        />
        {/* 예약 등록/수정 버튼 */}
        <SubmitButton />
        {/* 임시저장 버튼 */}
        <DraftButton onClick={handleDraftSave} />
      </form>

      {/* 임시저장 메뉴바 */}
      {isDraftMenuOpen && (
        <DraftMenuBar
          isOpen={isDraftMenuOpen}
          onClose={() => setIsDraftMenuOpen(false)}
          latestDraftId={latestDraftId}
        />
      )}
    </div>
  );
}
