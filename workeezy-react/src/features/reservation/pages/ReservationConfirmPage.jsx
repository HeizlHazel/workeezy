import { useParams } from "react-router-dom";
import PageLayout from "./../../../layout/PageLayout";
import { useState, useEffect } from "react";
import ReservationConfirmPreview from "../components/User/ReservationConfirmPreview";
import ReservationConfirmActions from "../components/ReservationConfirmActions";
import axios from "../../../api/axios.js";

export default function ReservationConfirmPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchConfirmData();
  }, []);

  const fetchConfirmData = async () => {
    try {
      const res = await axios.get(`/api/reservations/${id}/confirmation`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageLayout>
      <div className="confirm-container">
        <h2>예약 확정서</h2>

        {data && (
          <>
            <ReservationConfirmPreview data={data} />
            <ReservationConfirmActions reservationId={id} />
          </>
        )}
      </div>
    </PageLayout>
  );
}
