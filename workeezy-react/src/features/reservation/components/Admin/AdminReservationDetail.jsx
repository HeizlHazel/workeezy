import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationStatusButton from "../../../../shared/common/ReservationStatusButton";
import axios from "../../../../api/axios";
import "./AdminReservationDetail.css";
import Swal from "sweetalert2";

export default function AdminReservationDetail({ reservationId }) {
  const [reservation, setReservation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  const fetchDetail = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(`/api/admin/reservations/${reservationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservation(res.data);
  };

  if (!reservation) return <div>로딩중...</div>;

  /* ===== 상태 플래그 (CSS 영향 없음) ===== */
  const isWaitingPayment = reservation.status === "waiting_payment";
  const isCancelRequested = reservation.status === "cancel_requested";

  /* ===== 예약 승인 ===== */
  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "예약을 승인하시겠습니까?",
      text: "승인 후에는 예약자가 결제할 수 있습니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `/api/admin/reservations/${reservationId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "승인 완료",
        text: "예약이 승인되었습니다.",
        confirmButtonColor: "#4caf50",
      });

      fetchDetail();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "승인 실패",
        text:
          error.response?.data?.message || "예약 승인 중 오류가 발생했습니다.",
      });
    }
  };

  /* ===== 예약 반려 (waiting_payment 전용) ===== */
  const handleRejectReservation = async () => {
    const result = await Swal.fire({
      title: "예약을 반려하시겠습니까?",
      input: "textarea",
      inputLabel: "반려 사유",
      inputPlaceholder: "반려 사유를 입력해주세요",
      showCancelButton: true,
      confirmButtonText: "반려",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) return "반려 사유를 입력해주세요.";
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `/api/admin/reservations/${reservationId}/reject`,
        { reason: result.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "반려 완료",
        text: "예약이 반려 처리되었습니다.",
      });

      fetchDetail();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "반려 실패",
        text:
          error.response?.data?.message || "예약 반려 중 오류가 발생했습니다.",
      });
    }
  };

  /* ===== 취소 승인 ===== */
  const handleApproveCancel = async () => {
    const result = await Swal.fire({
      title: "취소 요청을 승인하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "취소 승인",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `/api/admin/reservations/${reservationId}/cancel/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "취소 완료",
        text: "예약이 취소되었습니다.",
      });

      fetchDetail();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "취소 승인 실패",
        text:
          error.response?.data?.message || "취소 승인 중 오류가 발생했습니다.",
      });
    }
  };

  /* ===== 취소 반려 ===== */
  const handleRejectCancel = async () => {
    const result = await Swal.fire({
      title: "취소 요청을 반려하시겠습니까?",
      input: "textarea",
      inputLabel: "반려 사유",
      inputPlaceholder: "반려 사유를 입력해주세요",
      showCancelButton: true,
      confirmButtonText: "취소 반려",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) return "반려 사유를 입력해주세요.";
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `/api/admin/reservations/${reservationId}/cancel/reject`,
        { reason: result.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "취소 반려 완료",
        text: "취소 요청이 반려되었습니다.",
      });

      fetchDetail();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "취소 반려 실패",
        text:
          error.response?.data?.message || "취소 반려 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="admin-detail-card">
      {/* 상단 상태/예약번호 */}
      <div className="detail-top">
        <div className="status-group">
          <ReservationStatusButton status={reservation.status} />
          <span className="reservation-no">{reservation.reservationNo}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="detail-body">
        <div className="image-box">
          <img src={reservation.imageUrl} alt="숙소 이미지" />
        </div>

        <div className="info-box">
          <p>
            <strong>예약자 :</strong> {reservation.userName}
          </p>
          <p>
            <strong>소속 :</strong> {reservation.company}
          </p>
          <p>
            <strong>연락처 :</strong> {reservation.phone}
          </p>
          <p>
            <strong>이메일 :</strong> {reservation.email}
          </p>
          <p>
            <strong>예약 날짜 :</strong> {reservation.startDate} ~{" "}
            {reservation.endDate}
          </p>
          <p>
            <strong>프로그램명 :</strong> {reservation.programTitle}
          </p>
          <p>
            <strong>숙소 :</strong> {reservation.stayName}
          </p>
          <p>
            <strong>룸타입 :</strong> {reservation.roomType}
          </p>
          <p>
            <strong>인원수 :</strong> {reservation.peopleCount}
          </p>
          <p>
            <strong>오피스명 :</strong> {reservation.officeName}
          </p>
        </div>
      </div>

      {/* 하단 버튼 (CSS 그대로 유지) */}
      <div className="detail-actions">
        {isWaitingPayment && (
          <>
            <button className="btn-approve" onClick={handleApprove}>
              승인
            </button>
            <button className="btn-reject" onClick={handleRejectReservation}>
              반송
            </button>
          </>
        )}

        {isCancelRequested && (
          <>
            <button className="btn-approve" onClick={handleApproveCancel}>
              취소 승인
            </button>
            <button className="btn-reject" onClick={handleRejectCancel}>
              취소 반려
            </button>
          </>
        )}
      </div>
    </div>
  );
}
