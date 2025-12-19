import PageLayout from "../../../layout/PageLayout.jsx";
import ReservationForm from "../components/User/ReservationForm.jsx";
import { useLocation } from "react-router-dom";

export default function NewReservationPage() {
  // const location = useLocation(); 현재 url, 쿼리, state 등을 담은 객체
  // const { state } = location || {};  그 중 state 꺼냄
  const { state } = useLocation() || {};

  return (
    <PageLayout>
      <ReservationForm
        // * ProgramReserveBar.jsx props *
        // 폼의 초기값
        initialData={state}
        // 선택 목록 옵션
        rooms={state?.rooms || []}
        // offices={state?.offices || []}
      />
    </PageLayout>
  );
}
