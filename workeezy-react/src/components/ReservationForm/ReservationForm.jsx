import { useState } from "react";
import ReservationFields from "../ReservationFields/ReservationFields";
import DraftButton from "../DraftButton/DraftButton";
import SubmitButton from "../SubmitButton/SubmitButton";
import "./ReservationForm.css";
import axios from "axios";

export default function ReservationForm() {
  const [form, setForm] = useState({
    userName: "",
    company: "",
    phone: "",
    email: "",
    startDate: "",
    endDate: "",
    officeName: "",
    roomType: "",
    peopleCount: 0, //
  });

  // 입력 폼 데이터
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 막기

    try {
      const response = await axios.post(
        "http://localhost:8080/api/reservations",
        form
      );
      console.log("서버 응답 완료 : " + response.data);
      alert("예약이 성공적으로 전송됨!");
    } catch (error) {
      console.error("❌ 예약 전송 실패:", error);
      alert("예약 전송 중 오류가 발생했습니다.");
      console.log("제출 데이터:", form);
    }
  };

  // 입력 창 건들 때마다 새로운 객체로 생성!
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 임시 저장
  const handleDraftSave = () => {
    console.log(" 임시저장:" + form);
    localStorage.setItem("reservationDraft", JSON.stringify(form));
  };

  return (
    <div className="form">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <ReservationFields {...form} onChange={handleChange} />
        <SubmitButton />
        <DraftButton onClick={handleDraftSave} />
      </form>
    </div>
  );
}
