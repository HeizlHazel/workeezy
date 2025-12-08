import React from "react";
import "./AdminReservationSection.css";

export default function AdminReservationSection({ children }) {
  return (
    <div className="admin-reservation-section">
      <div className="admin-reservation-wrapper">{children}</div>
    </div>
  );
}
