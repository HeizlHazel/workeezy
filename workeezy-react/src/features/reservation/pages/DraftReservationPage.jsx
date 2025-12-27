// import AdminReservationSection from "../components/Admin/AdminReservationSection.jsx"
import DraftListSection from "../components/User/DraftListSection.jsx";
import DraftReservationList from "../components/User/DraftReservationList.jsx";
import PageLayout from "../../../layout/PageLayout.jsx";

export default function DraftReservationPage() {
  return (
    <PageLayout>
      <DraftListSection>
        <h2 className="page-title">📝 작성 중인 예약</h2>
        <DraftReservationList />
      </DraftListSection>
    </PageLayout>
  );
}
