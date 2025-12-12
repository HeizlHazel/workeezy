import React from "react";
import "./ReservationStatusButton.css";

/**
 * 예약 상태 버튼
 * props:
 * - status: "PENDING" | "CONFIRMED" | "CANCELLED"
 */
export default function ReservationStatusButton({ status }) {
  let label = "";
  let icon = "";
  let className = "reservation-status-btn";

  switch (status) {
    case "PENDING":
      label = "대기";
      icon = "/reservationStatusIcons/pending.svg";
      className += " pending";
      break;
    case "CONFIRMED":
      label = "확정";
      icon = "/reservationStatusIcons/confirmed.svg";
      className += " confirmed";
      break;
    case "CANCELLED":
      label = "취소";
      icon = "/reservationStatusIcons/cancelled.svg";
      className += " cancelled";
      break;
    default:
      label = "알 수 없음";
      className += " unknown";
  }

  return (
    <div className={className}>
      {icon && <img src={icon} alt={label} className="icon" />}
      <div className="label">{label}</div>
    </div>
  );
}
