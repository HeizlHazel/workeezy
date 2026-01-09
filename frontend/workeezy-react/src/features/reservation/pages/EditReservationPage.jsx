import PageLayout from "../../../layout/PageLayout.jsx";
import ReservationForm from "../components/User/ReservationForm.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../api/axios.js";

export default function EditReservationPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      // 예약 시점에 저장된 데이터
      const res = await axios.get(`/api/reservations/${id}`);
      const reservation = res.data;
      // console.log("===== reservation raw =====");
      // console.log(reservation);
      // console.log("reservation.roomId =", reservation.roomId);
      // console.log("reservation.room =", reservation.room);
      // console.log("===========================");

      // 현재 시점의 프로그램 상태
      const programRes = await axios.get(
        `/api/programs/${reservation.programId}`
      );

      setData({
        ...reservation, // 예약 기준 데이터
        roomId: reservation.roomId, // 예약된 룸타입
        rooms: programRes.data.hotel?.rooms ?? [], // 선택 가능한 전체 룸타입
        stayId: programRes.data.hotel?.id, // 프로그램 기준
        stayName: programRes.data.hotel?.name, // 프로그램 기준
      });
    };

    fetch();
  }, [id]);

  if (!data) return <div>로딩중...</div>;

  return (
    <PageLayout>
      <ReservationForm mode="edit" initialData={data} rooms={data.rooms} />
    </PageLayout>
  );
}
