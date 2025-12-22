import axios from "../../../api/axios.js";

export async function cancelReservation(reservationId) {
  const token = localStorage.getItem("accessToken");

  return axios.patch(
    `/api/reservations/${reservationId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
