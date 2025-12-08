import React from "react";
import "./ReservationStatusButton.css";

import cancelled from "../../../public/reservationStatusIcons/cancelled.svg";
import confirmed from "../../../public/reservationStatusIcons/confirmed.svg";
import pending from "../../../public/reservationStatusIcons/pending.svg";

/**
 * 예약 상태 버튼
 * props:
 * - status: "PENDING" | "CONFIRMED" | "CANCELLED"
 */
export default function ReservationStatusButton({ status }) {
  let label = "";
  let icon = null;
  let className = "reservation-status-btn";

  switch (status) {
    case "PENDING":
      label = "대기";
      icon = pending;
      className += " pending";
      break;
    case "CONFIRMED":
      label = "확정";
      icon = confirmed;
      className += " confirmed";
      break;
    case "CANCELLED":
      label = "취소";
      icon = cancelled;
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
