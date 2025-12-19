import PageLayout from "../../../layout/PageLayout.jsx";
import ReservationForm from "../components/User/ReservationForm.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../api/axios.js";

export default function EditReservationPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetch = async () => {
      // 1️⃣ 예약 상세
      const res = await axios.get(`/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservation = res.data;
      console.log("===== reservation raw =====");
      console.log(reservation);
      console.log("reservation.roomId =", reservation.roomId);
      console.log("reservation.room =", reservation.room);
      console.log("===========================");

      // 2️⃣ 프로그램 정보
      const programRes = await axios.get(
        `/api/programs/${reservation.programId}`
      );

      setData({
        ...reservation,
        roomId: reservation.roomId,
        rooms: programRes.data.hotel?.rooms ?? [],
        stayId: programRes.data.hotel?.id,
        stayName: programRes.data.hotel?.name,
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
