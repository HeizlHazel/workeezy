import PageLayout from "../../../layout/PageLayout.jsx";
import AdminReservationSection from "../components/Admin/AdminReservationSection.jsx";
import AdminReservationContainer from "../components/Admin/AdminReservationContainer.jsx";

export default function AdminReservationPage() {
  return (
    <PageLayout>
      <AdminReservationSection>
        <h2 className="page-title">예약 관리</h2>
        <AdminReservationContainer />
      </AdminReservationSection>
    </PageLayout>
  );
}
