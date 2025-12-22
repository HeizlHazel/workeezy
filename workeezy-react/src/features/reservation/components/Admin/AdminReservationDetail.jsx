import { useEffect, useState } from "react";
import ReservationStatusButton from "../../../../shared/common/ReservationStatusButton";
import axios from "../../../../api/axios";
import { formatLocalDateTime } from "../../../../utils/dateTime";
import "./AdminReservationDetail.css";

export default function AdminReservationDetail({ reservationId }) {
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`/api/admin/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReservation(res.data));
  }, [reservationId]);

  if (!reservation) return <div>로딩중...</div>;

  return (
    <div className="admin-detail-card">
      <ReservationStatusButton status={reservation.status} />

      <p>예약번호: {reservation.reservationNo}</p>
      <p>
        기간: {formatLocalDateTime(reservation.startDate)} ~{" "}
        {formatLocalDateTime(reservation.endDate)}
      </p>
      <p>예약자: {reservation.userName}</p>
      <p>숙소: {reservation.stayName}</p>
      <p>룸타입: {reservation.roomType}</p>
      <p>인원: {reservation.peopleCount}</p>
    </div>
  );
}
