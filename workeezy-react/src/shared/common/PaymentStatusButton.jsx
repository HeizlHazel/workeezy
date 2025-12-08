import React from "react";
import "./PaymentStatusButton.css";

/**
 * 결제 상태 버튼
 * props:
 * - status: "WAITING" | "DONE" | "CANCELLED"
 */
export default function PaymentStatusButton({ status }) {
  let label = "";
  let className = "payment-btn";

  switch (status) {
    case "WAITING":
      label = "결제 대기";
      className += " waiting";
      break;
    case "DONE":
      label = "결제 완료";
      className += " done";
      break;
    case "CANCELLED":
      label = "결제 취소";
      className += " cancelled";
      break;
    default:
      label = "알 수 없음";
      className += " unknown";
  }

  return (
    <div className={className}>
      <div className="label">{label}</div>
    </div>
  );
}
