import { useNavigate } from "react-router-dom";
import { useReservationPolicy } from "../hooks/useReservationPolicy.js";
import { cancelReservation } from "../api/reservationApi";
import Swal from "sweetalert2";

export default function ReservationCardActions({ reservation }) {
  const navigate = useNavigate();
  const policy = useReservationPolicy(reservation);

  // 예약 취소
  const handleCancel = async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "예약을 취소하시겠습니까?",
      text: "취소 후에는 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "취소하기",
      cancelButtonText: "닫기",
    });
    if (!result.isConfirmed) return;

    try {
      await cancelReservation(reservation.id);

      await Swal.fire({
        title: "취소 완료",
        text: "예약이 취소되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });

      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "취소 실패",
        text: "예약 취소 중 오류가 발생했습니다.",
        icon: "error",
      });
    }
  };

  // 반려 사유 확인
  const handleShowRejectReason = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: "예약이 반려 되었습니다",
      text: reservation.rejectReason || "반려 사유가 없습니다.",
      icon: "info",
      confirmButtonText: "확인",
    });
  };

  return (
    <>
      {/* rejected 전용 */}
      {policy.showRejectReason && (
        <button onClick={handleShowRejectReason}>반려 사유 확인</button>
      )}

      {policy.showResubmit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/reservation/resubmit/${reservation.id}`);
          }}
        >
          재신청
        </button>
      )}
      {/* 예약 취소 */}
      {policy.showDirectCancel && (
        <button onClick={handleCancel}>예약 취소</button>
      )}
      {policy.showCancelRequest && <button>예약 취소 요청</button>}

      {/* 예약 변경 */}
      {policy.showChange && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/reservation/edit/${reservation.id}`);
          }}
        >
          예약 변경
        </button>
      )}
      {policy.showChangeRequest && <button>예약 변경 신청</button>}

      {/* 확정서 및 결제 */}

      {policy.showConfirmDoc && <button>예약 확정서</button>}
      {policy.showPayment && <button>결제 내역</button>}
      {policy.showPaymentWidget && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/payment/${reservation.id}`);
          }}
        >
          결제하기
        </button>
      )}
    </>
  );
}
