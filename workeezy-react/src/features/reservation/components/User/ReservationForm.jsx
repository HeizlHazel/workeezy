import { useEffect, useState } from "react";
import ReservationFields from "./ReservationFields.jsx";
import "./ReservationForm.css";
import axios from "../../../../api/axios.js";
import DraftMenuBar from "./DraftMenuBar.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import ReservationActions from "../ReservationActions.jsx";
import { toLocalDateTimeString } from "../../../../utils/dateTime";

// 생성 및 수정시 : null 안전 숫자 변환 유틸
const parseNullableNumber = (value) =>
  value === "" || value === null || value === undefined ? null : Number(value);

export default function ReservationForm({
  initialData,
  rooms = [],
  offices = [],
  mode = "create",
}) {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const location = useLocation();
  const { draftKey } = location.state || {};

  const { programId, roomId, officeId, checkIn, checkOut } = initialData || {};
  const selectedRoom = rooms.find((r) => r.id === Number(roomId));
  const selectedOffice = offices.find((o) => o.id === Number(officeId));

  /* =========================
     form 상태
  ========================= */
  const [form, setForm] = useState({
    programId: programId || "",
    programTitle: "",
    userName: "",
    company: "",
    phone: "",
    email: "",
    startDate: checkIn ? new Date(checkIn) : null,
    endDate: checkOut ? new Date(checkOut) : null,
    officeName: selectedOffice?.name || "",
    officeId: selectedOffice?.id || "",
    roomType: selectedRoom?.roomType || "",
    roomId: selectedRoom?.id || "",
    peopleCount: 1,
    stayId: initialData?.stayId || "",
    stayName: initialData?.stayName || "",
  });

  /* =========================
     임시저장
  ========================= */
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [latestDraftId, setLatestDraftId] = useState(null);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(null);

  /* =========================
     초기 데이터 반영
  ========================= */
  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => ({
      ...prev,
      programId: initialData.programId || prev.programId,
      programTitle: initialData.programTitle || prev.programTitle,

      startDate:
        initialData.checkIn || initialData.startDate
          ? new Date(initialData.checkIn || initialData.startDate)
          : prev.startDate,

      endDate:
        initialData.checkOut || initialData.endDate
          ? new Date(initialData.checkOut || initialData.endDate)
          : prev.endDate,

      stayId: initialData.stayId || prev.stayId,
      stayName: initialData.stayName || prev.stayName,

      officeId: initialData.officeId || selectedOffice?.id || prev.officeId,
      officeName:
        initialData.officeName || selectedOffice?.name || prev.officeName,

      roomId: initialData.roomId || selectedRoom?.id || prev.roomId,
      roomType: initialData.roomType || selectedRoom?.roomType || prev.roomType,

      userName: initialData.userName || prev.userName,
      company: initialData.company || prev.company,
      email: initialData.email || prev.email,
      phone: initialData.phone || prev.phone,

      peopleCount: initialData.peopleCount || prev.peopleCount,
    }));
  }, [initialData, selectedRoom, selectedOffice]);

  /* =========================
     유저 정보 자동 채우기
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));

      setForm((prev) => ({
        ...prev,
        userName: userData.name || prev.userName,
        company: userData.company || prev.company,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
      }));
    };

    fetchUser();
  }, []);

  /* =========================
     입력 변경
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     제출
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      if (initialData?.id) {
        await axios.put(
          `http://localhost:8080/api/reservations/${initialData.id}`,
          {
            startDate: toLocalDateTimeString(form.startDate),
            endDate: toLocalDateTimeString(form.endDate),
            roomId: Number(form.roomId),
            officeId: parseNullableNumber(form.officeId),
            peopleCount: form.peopleCount,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/reservations",
          {
            ...form,
            startDate: toLocalDateTimeString(form.startDate),
            endDate: toLocalDateTimeString(form.endDate),
            programId: Number(form.programId),
            roomId: Number(form.roomId),
            officeId: parseNullableNumber(form.officeId),
            stayId: Number(form.stayId),
            draftKey,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("예약이 성공적으로 처리되었습니다.");
      navigate("/reservation/list");
    } catch (e) {
      console.error(e);
      alert("예약 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="form">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <ReservationFields
          {...form}
          rooms={rooms}
          offices={offices}
          onChange={handleChange}
        />
        <ReservationActions
          isEdit={isEdit}
          onOpenDraft={() => setIsDraftMenuOpen((p) => !p)}
        />
      </form>

      {!isEdit && isDraftMenuOpen && (
        <DraftMenuBar
          isOpen={isDraftMenuOpen}
          onClose={() => setIsDraftMenuOpen(false)}
          latestDraftId={latestDraftId}
          form={form}
          rooms={rooms}
          offices={offices}
          onSaved={setLatestDraftId}
          onSnapshotSaved={setLastSavedSnapshot}
          lastSavedSnapshot={lastSavedSnapshot}
        />
      )}
    </div>
  );
}
