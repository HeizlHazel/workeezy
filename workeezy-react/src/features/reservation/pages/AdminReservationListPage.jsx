import PageLayout from "../../../layout/PageLayout.jsx";
import AdminReservationSection from "../components/AdminReservationSection";
import AdminReservationList from "../components/AdminReservationList";

export default function AdminReservationListPage() {
  return (
    <PageLayout>
      <AdminReservationSection>
        <h2 className="page-title">예약 관리</h2>
        <AdminReservationList />
      </AdminReservationSection>
    </PageLayout>
  );
}
