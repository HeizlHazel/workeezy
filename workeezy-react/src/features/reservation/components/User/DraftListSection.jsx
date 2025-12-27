import React from "react";
import "./DraftListSection.css";

export default function DraftListSection({ children }) {
  return (
    <div className="user-draft-section">
      <div className="user-draft-wrapper">{children}</div>
    </div>
  );
}
