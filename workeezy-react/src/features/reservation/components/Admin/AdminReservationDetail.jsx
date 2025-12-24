import { useEffect, useState } from "react";
import ReservationStatusButton from "../ReservationStatusButton.jsx";
import axios from "../../../../api/axios";
import { formatLocalDateTime } from "../../../../utils/dateTime";
import "./AdminReservationDetail.css";
import Swal from "sweetalert2";

export default function AdminReservationDetail({ reservationId }) {
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    Swal.fire({
      title: "예약 정보를 불러오는 중",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    axios
      .get(`/api/admin/reservations/${reservationId}`)
      .then((res) => {
        setReservation(res.data);
        Swal.close();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "조회 실패",
          text: "예약 정보를 불러오지 못했습니다.",
        });
      });
  }, [reservationId]);

  if (!reservation) return null;

  const isWaitingPayment = reservation.status === "waiting_payment";
  const isCancelRequested = reservation.status === "cancel_requested";

  /* 공통 액션 헬퍼 */
  const confirmAndExecute = async (config, apiCall) => {
    const result = await Swal.fire(config);
    if (!result.isConfirmed) return;
    await apiCall(result.value);
    fetchDetail();
  };

  return (
    <div className="admin-detail-card">
      <ReservationStatusButton status={reservation.status} />

      <dl className="reservation-detail">
        <div>
          <dt>예약번호</dt>
          <dd>{reservation.reservationNo}</dd>
        </div>
        <div>
          <dt>프로그램명</dt>
          <dd>{reservation.programTitle}</dd>
        </div>

        <div>
          <dt>기간</dt>
          <dd>
            {formatLocalDateTime(reservation.startDate)} ~{" "}
            {formatLocalDateTime(reservation.endDate)}
          </dd>
        </div>

        <div>
          <dt>예약자</dt>
          <dd>{reservation.userName}</dd>
        </div>

        <div>
          <dt>숙소</dt>
          <dd>{reservation.stayName}</dd>
        </div>

        <div>
          <dt>룸 타입</dt>
          <dd>{reservation.roomType}</dd>
        </div>

        <div>
          <dt>인원</dt>
          <dd>{reservation.peopleCount}명</dd>
        </div>

        <div>
          <dt>오피스</dt>
          <dd>{reservation.officeName}</dd>
        </div>
      </dl>

      {/* 관리자 액션 */}
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
    </div>
  );
}
