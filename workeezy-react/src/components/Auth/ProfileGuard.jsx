import { Navigate } from "react-router-dom";

export default function ProfileGuard({ children }) {
  const verified = localStorage.getItem("profileVerified");

  if (!verified) {
    return <Navigate to="/profilecheck" replace />;
  }

  return children;
}
