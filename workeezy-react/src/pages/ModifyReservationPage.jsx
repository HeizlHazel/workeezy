import ReservationForm from "../components/ReservationForm/ReservationForm";
import PageLayout from "../layout/PageLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ModifyReservationPage() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);

  // 컴포넌트가 처음 렌더링될 때 딱 한 번 실행
  useEffect(() => {
    // 서버에서 데이터를 담아올 때까지 기다렸다가 다음 줄 실행
    // 비동기 함수 async를 쓰면, 그 안에서 await 키워드로 다음 구문을 기다려달라는 오류
    const fetchReservation = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/reservations/${id}`
      );
      setReservation(response.data);
    };
    fetchReservation();
  }, [id]); // url에 적힌 id값이 바뀌었는지 감지. 렌더링될 때 이게 바뀌었는지 감지!

  // reservation이 아직 null로 서버에서 응답이 오기전,
  if (!reservation) return <div>불러오는 중...</div>;
  // 응답이 오면 아래 리턴 구문 실행!
  return (
    <PageLayout>
      <ReservationForm initialData={reservation} />
    </PageLayout>
  );
}
