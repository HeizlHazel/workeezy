import { useEffect, useState } from "react";
import ReservationFields from "./ReservationFields.jsx";
import DraftButton from "./DraftButton.jsx";
import SubmitButton from "./SubmitButton.jsx";
import "./ReservationForm.css";
import axios from "../../../api/axios.js";
import DraftMenuBar from "./DraftMenuBar";

export default function ReservationForm({ initialData }) {
  const [form, setForm] = useState(
    initialData || {
      // programId: null,
      programTitle: "",
      userName: "",
      company: "",
      phone: "",
      email: "",
      startDate: "",
      endDate: "",
      placeName: "",
      roomType: "",
      peopleCount: 0,
    }
  );

  // 메뉴바 열림 / 닫힘 상태 관리
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);

  // 최곤 저장된 임시저장 식별용(New! 표시용)
  const [latestDraftId, setLatestDraftId] = useState(null);

  // 서버에서 initalData가 들어왔을 때 form에 반영
  useEffect(() => {
    if (!initialData) return;
    // form과 내용이 다를 때만 업데이트(불필요한 setState 방지)
    if (JSON.stringify(initialData) !== JSON.stringify(form)) {
      //JSON.stringify()는 자바스크립트 객체를 문자열로
      setForm(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // 입력 변경시 state 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  console.log("📤 전송할 form 데이터:", form);

  // 입력 폼 데이터
  const handleSubmit = async (e) => {
    e.preventDefault(); // 브라우저 새로고침 막기

    const token = localStorage.getItem("accessToken");

    try {
      if (initialData) {
        // PUT : 기존 예약 수정
        await axios.put(
          `http://localhost:8080/api/reservations/${initialData.id}`,
          form
        );
        alert("예약이 성공적으로 수정 되었습니다!");
      } else {
        // POST : 신규 예약
        await axios.post("http://localhost:8080/api/reservations", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        alert("예약이 성공적으로 등록되었습니다!");
      }
    } catch (error) {
      console.error("예약 전송 실패", error);
      alert("예약 처리 중 오류가 발생했습니다.");
    }
  };

  // 임시 저장
  const handleDraftSave = async () => {
    const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 JWT 토큰

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    // 워케이션 명을 제목으로 지정
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

      // ✅ 방금 저장된 draft ID 저장 (New! 표시용)
      setLatestDraftId(res.data.id || Date.now());
      // ✅ 메뉴 열기
      setIsDraftMenuOpen(true);

      alert("임시저장 완료!");
    } catch (error) {
      console.error("임시저장 실패", error);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  // 임시 저장 불러오기

  return (
    <div className="form">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <ReservationFields {...form} onChange={handleChange} />
        <SubmitButton />
        {/* 임시저장 버튼 클릭시 임시저장 + 메뉴 열기 */}
        <DraftButton onClick={handleDraftSave} />
      </form>

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
