import AdminReservationSection from "../components/Admin/AdminReservationSection.jsx";
import DraftReservationList from "../components/User/DraftReservationList.jsx";
import PageLayout from "../../../layout/PageLayout.jsx";

export default function DraftReservationPage() {
  return (
    <PageLayout>
      <AdminReservationSection>
        <h2 className="page-title">📝 임시 저장된 예약</h2>
        <DraftReservationList />
      </AdminReservationSection>
    </PageLayout>
  );
}
