import PageLayout from "../../../layout/PageLayout.jsx";
import AdminReservationSection from "../components/Admin/AdminReservationSection.jsx";
import AdminReservationContainer from "../components/Admin/AdminReservationContainer.jsx";

export default function AdminReservationPage() {
  return (
    <PageLayout>
      <AdminReservationSection>
        <h2 className="page-title admin-title" style={{ marginTop: "22px" }}>
          <span
            className="icon"
            style={{ marginRight: "15px", fontSize: "22px" }}
          >
            🖍
          </span>
          예약 관리
        </h2>
        <AdminReservationContainer />
      </AdminReservationSection>
    </PageLayout>
  );
}
