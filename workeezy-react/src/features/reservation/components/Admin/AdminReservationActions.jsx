import Swal from "sweetalert2";
import axios from "../../../../api/axios";

export default function AdminReservationActions({
  reservationId,
  status,
  onSuccess,
}) {
  const isWaitingPayment = status === "waiting_payment";
  const isCancelRequested = status === "cancel_requested";

  const confirmAndExecute = async (config, apiCall) => {
    const result = await Swal.fire(config);
    if (!result.isConfirmed) return;

    await apiCall(result.value);
    await onSuccess();
  };

  return (
    <div className="detail-actions">
      {isWaitingPayment && (
        <>
          <button
            className="btn-approve"
            onClick={() =>
              confirmAndExecute(
                {
                  title: "예약 승인",
                  text: "예약을 승인하시겠습니까?",
                  showCancelButton: true,
                },
                () =>
                  axios.patch(
                    `/api/admin/reservations/${reservationId}/approve`
                  )
              )
            }
          >
            승인
          </button>

          <button
            className="btn-reject"
            onClick={() =>
              confirmAndExecute(
                {
                  title: "예약 반려",
                  input: "textarea",
                  inputPlaceholder: "반려 사유 입력",
                  showCancelButton: true,
                },
                (reason) =>
                  axios.patch(
                    `/api/admin/reservations/${reservationId}/reject`,
                    { reason }
                  )
              )
            }
          >
            반려
          </button>
        </>
      )}

      {isCancelRequested && (
        <>
          <button
            className="btn-approve"
            onClick={() =>
              confirmAndExecute(
                {
                  title: "취소 승인",
                  showCancelButton: true,
                },
                () =>
                  axios.patch(
                    `/api/admin/reservations/${reservationId}/cancel/approve`
                  )
              )
            }
          >
            취소 승인
          </button>

          <button
            className="btn-reject"
            onClick={() =>
              confirmAndExecute(
                {
                  title: "취소 반려",
                  input: "textarea",
                  showCancelButton: true,
                },
                (reason) =>
                  axios.patch(
                    `/api/admin/reservations/${reservationId}/cancel/reject`,
                    { reason }
                  )
              )
            }
          >
            취소 반려
          </button>
        </>
      )}
    </div>
  );
}
