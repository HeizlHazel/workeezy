import axios from "../../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "./ReservationConfirmActions.css";

export default function ReservationConfirmActions({ reservationId }) {
  const navigate = useNavigate();
  const handleDownload = async () => {
    try {
      // 1. PDF 생성 (없으면 생성, 있으면 덮어씀)
      await axios.post(`/api/reservations/${reservationId}/confirmation`);

      // 2. 다운로드
      const res = await axios.get(
        `/api/reservations/${reservationId}/confirmation/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservation_${reservationId}.pdf`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("PDF 생성 또는 다운로드 실패");
    }
  };
  const handleGoList = () => {
    navigate("/reservation/list");
  };
  return (
    <div className="confirm-actions">
      <button onClick={handleDownload}> 📄 PDF 다운로드</button>
      <button onClick={() => window.print()}> 🖨️ 출력</button>
      <button className="secondary" onClick={handleGoList}>
        ← 이전으로
      </button>
    </div>
  );
}
