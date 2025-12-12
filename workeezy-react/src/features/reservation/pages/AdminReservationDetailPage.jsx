import PageLayout from "../../../layout/PageLayout.jsx";
import AdminReservationSection from "../components/AdminReservationSection";
import AdminReservationListView from "../components/AdminReservationListView";

export default function AdimnReservationListPage() {
  return (
    <PageLayout>
      <AdminReservationSection>
        <h2 className="page-title">예약 관리</h2>
        <AdminReservationListView />
      </AdminReservationSection>
    </PageLayout>
  );
}
