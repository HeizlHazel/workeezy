import { useState } from "react";
import ReservationFields from "../ReservationFields/ReservationFields";
import DraftButton from "../DraftButton/DraftButton";
import SubmitButton from "../SubmitButton/SubmitButton";
import "./ReservationForm.css";

export default function ReservationForm() {
  const [form, setForm] = useState({
    userName: "",
    userCompany: "",
    userPhone: "",
    userMail: "",
    startedAt: "",
    endedAt: "",
    office: "",
    roomType: "",
    peopleCount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📩 제출 데이터:", form);
  };

  const handleDraftSave = () => {
    console.log("💾 임시저장:", form);
    localStorage.setItem("reservationDraft", JSON.stringify(form));
  };

  return (
    <div className="form">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <ReservationFields form={form} onChange={handleChange} />
        <SubmitButton />
        <DraftButton onClick={handleDraftSave} />
      </form>
    </div>
  );
}
