// AdminReservationContainer.jsx
import { useParams } from "react-router-dom";
import AdminReservationList from "./AdminReservationList.jsx";
import AdminReservationDetail from "./AdminReservationDetail.jsx";

export default function AdminReservationContainer() {
  const { reservationId } = useParams();

  if (reservationId) {
    return <AdminReservationDetail reservationId={reservationId} />;
  }

  return <AdminReservationList />;
}
