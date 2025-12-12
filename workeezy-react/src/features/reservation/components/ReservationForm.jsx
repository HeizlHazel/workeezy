import { useEffect, useState } from "react";
import ReservationFields from "./ReservationFields.jsx";
import DraftButton from "./DraftButton.jsx";
import SubmitButton from "./SubmitButton.jsx";
import "./ReservationForm.css";
import axios from "../../../api/axios.js";
import DraftMenuBar from "./DraftMenuBar";
import { useNavigate } from "react-router-dom";

export default function ReservationForm({
  initialData, // 사용자가 선택한 초기 데이터
  rooms = [], // 해당 워케이션 프로그램에서 선택 가능한 룸
  offices = [], // 해당 워케이션 프로그램에서 선택 가능한 오피스
}) {
  const navigate = useNavigate();
  // 초기 데이터에서 필요한 값만 꺼냄
  const { programId, roomId, officeId, checkIn, checkOut } = initialData || {};

  // 각 배열에서 find 메소드를 이용해 각 요소(객체)를 순회하면서
  // 사용자가 선택한 Id와 같은 Id를 가진 첫 번째 객체를 찾아서 반환한다.
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
    officeName: selectedOffice?.name || "", // 화면 표시용 이름
    officeId: selectedOffice?.id || "",
    roomType: selectedRoom?.roomType || "", // 화면 표시용 이름
    roomId: selectedRoom?.id || "",
    peopleCount: 1,
    stayId: initialData.stayId || "",
    stayName: initialData.stayName || "",
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
      setForm((prev) => ({
        ...prev, // 기존 form을 베이스로 하고 아래 필드로 덮어쓰기

        // 초기값 우선, 초기값 없으면 기존 prev 값
        programId: initialData.programId || prev.programId,
        programTitle: initialData.programTitle || prev.programTitle,

        // DraftData 및 ReservationData Data 동시 처리
        // checkIn - 예약바 / startDate - 임시저장 및 수정 데이터
        startDate:
          initialData.checkIn || initialData.startDate
            ? new Date(initialData.checkIn || initialData.startDate)
                .toISOString()
                .slice(0, 10)
            : prev.startDate,

        endDate:
          initialData.checkOut || initialData.endDate
            ? new Date(initialData.checkOut || initialData.endDate)
                .toISOString()
                .slice(0, 10)
            : prev.endDate,

        // 숙소 정보 반영
        stayId: initialData.stayId || prev.stayId,
        stayName: initialData.stayName || prev.stayName,

        // 장소, 방 타입
        officeId: initialData.officeId || selectedOffice?.id || prev.officeId,
        officeName:
          initialData.officeName || selectedOffice?.name || prev.officeName,

        roomId: initialData.roomId || selectedRoom?.id || prev.roomId,
        roomType:
          initialData.roomType || selectedRoom?.roomType || prev.roomType,

        // 사용자 정보
        userName: initialData.userName || prev.userName,
        company: initialData.company || prev.company,
        email: initialData.email || prev.email,
        phone: initialData.phone || prev.phone,

        peopleCount: initialData.peopleCount || prev.peopleCount,
      }));
    }
  }, [initialData, selectedRoom, selectedOffice]);

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

        // form 자동 채우기(프로그램 정보가 기본으로 세팅된 prev)
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
  }, []); // 첫 마운트 때 한번

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

    // Number 캐스팅
    const formattedForm = {
      ...form,
      programId: Number(form.programId),
      roomId: Number(form.roomId),
      officeId: Number(form.officeId),
      stayId: Number(form.stayId),
    };

    try {
      if (initialData && initialData.id) {
        // id가 있으면 예약 수정
        // console.log("🧾 initialData:", initialData);
        await axios.put(
          `http://localhost:8080/api/reservations/${initialData.id}`,
          formattedForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert("예약이 성공적으로 수정 되었습니다!");
        navigate("/reservation/list");
      } else {
        // 신규 예약 등록
        await axios.post(
          "http://localhost:8080/api/reservations",
          formattedForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert("예약이 성공적으로 등록되었습니다!");
        navigate("/reservation/list");
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
    const token = localStorage.getItem("accessToken");
    // 로그인 시 저장된 JWT 토큰

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    // 워케이션 명을 draft 제목으로 지정
    const draftData = {
      ...form,
      title: form.programTitle,
      rooms,
      offices,
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
  // 불러오기 기능은 DraftMenuBar 내부에서 실행(props 통해 연결)

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
