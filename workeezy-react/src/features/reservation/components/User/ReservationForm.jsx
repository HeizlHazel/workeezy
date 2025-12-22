import { useEffect, useState } from "react";
import ReservationFields from "./ReservationFields.jsx";
import "./ReservationForm.css";
import axios from "../../../../api/axios.js";
import DraftMenuBar from "./DraftMenuBar.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import ReservationFormActions from "../ReservationFormActions.jsx";
import { toLocalDateTimeString } from "../../../../utils/dateTime";
import Swal from "sweetalert2";

export default function ReservationForm({
  initialData, // 프로그램 아이디, 룸id, 체크인-체크아웃
  // rooms = [],
  mode = "create",
}) {
  // 초기 데이터 객체 구조 분해 할당
  const { programId, roomId, checkIn, checkOut } = initialData || {};
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const location = useLocation();
  const { draftKey } = location.state || {};
  // 예약용 프로그램 조회 결과로 얻은 rooms
  const [rooms, setRooms] = useState([]);

  /* =========================
     form 초기 상태
  ========================= */
  const [form, setForm] = useState({
    programId: "",
    programTitle: "",
    programPrice: 0,

    stayId: "",
    stayName: "",

    officeId: "",
    officeName: "",

    roomId: "",
    roomType: "",

    startDate: checkIn ? new Date(checkIn) : null,
    endDate: checkOut ? new Date(checkOut) : null,

    peopleCount: 1,

    userName: "",
    company: "",
    email: "",
    phone: "",
  });

  /* =========================
   initialData 기반 form 동기화 (edit + draft)
========================= */
  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => ({
      ...prev,
      ...initialData,
      startDate: initialData.startDate ? new Date(initialData.startDate) : null,
      endDate: initialData.endDate ? new Date(initialData.endDate) : null,
    }));
  }, [initialData]);

  /* =========================
     임시저장 관련 useState
  ========================= */
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [latestDraftId, setLatestDraftId] = useState(null);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(null);

  /* =========================
   해당 프로그램 예약시 프로그램 데이터 재조회 (예약 전용)
  ========================= */
  useEffect(() => {
    if (!programId) return;

    const fetchProgramForReservation = async () => {
      Swal.fire({
        title: "예약 정보를 불러오는 중이에요",
        text: "잠시만 기다려주세요",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const res = await axios.get(`/api/programs/${programId}/reservation`);
        const data = res.data;

        // 사용자가 선택한 room 객체
        const selectedRoom = data.rooms.find(
          (r) => r.roomId === Number(roomId)
        );

        // 해당 프로그램의 rooms
        setRooms(data.rooms);

        // 사용자에게 보여줄 초기 폼 세팅
        setForm((prev) => ({
          ...prev,
          programId: data.programId,
          programTitle: data.programTitle, // 사용자 ux
          programPrice: data.programPrice, // 사용자 UX

          stayId: data.stayId,
          stayName: data.stayName, // 사용자 UX

          officeId: data.officeId,
          officeName: data.officeName, // 사용자 UX

          roomId: roomId ? String(roomId) : "",
          roomType: selectedRoom?.roomType ?? "", // 사용자 UX

          startDate: checkIn ? new Date(checkIn) : prev.startDate,
          endDate: checkOut ? new Date(checkOut) : prev.endDate,
        }));
      } catch (e) {
        console.error("예약용 프로그램 조회 실패", e);
      } finally {
        Swal.close();
      }
    };

    fetchProgramForReservation();
  }, [programId, roomId, checkIn, checkOut]);

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
     입력 폼 제출
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
            draftKey,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const isEdit = Boolean(initialData?.id);

      await Swal.fire({
        icon: "success",
        title: isEdit ? "예약 수정 완료 ✏️" : "예약 신청 완료 🎉",
        text: isEdit
          ? "예약 정보가 성공적으로 수정되었습니다."
          : "예약이 성공적으로 신청되었습니다.",
        confirmButtonText: "확인",
      });
      navigate("/reservation/list");
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "예약 신청 실패",
        text: "예약 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="form">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <ReservationFields
          {...form}
          rooms={rooms}
          // offices={offices}
          onChange={handleChange}
        />
        <ReservationFormActions
          isEdit={isEdit}
          onOpenDraft={() => setIsDraftMenuOpen((p) => !p)}
        />
      </form>

      {!isEdit && isDraftMenuOpen && (
        <DraftMenuBar
          form={form} // 임시저장 데이터
          isOpen={isDraftMenuOpen} // 열림-닫힘 상태
          onClose={() => setIsDraftMenuOpen(false)}
          latestDraftId={latestDraftId} // 최근 임시저장 데이터 식별
          onSaved={setLatestDraftId}
          onSnapshotSaved={setLastSavedSnapshot} // 마지막 스냅샷
          lastSavedSnapshot={lastSavedSnapshot}
        />
      )}
    </div>
  );
}
