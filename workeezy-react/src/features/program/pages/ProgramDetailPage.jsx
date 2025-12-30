import PageLayout from "../../../layout/PageLayout.jsx";

import { ProgramDetailProvider, useProgramDetail } from "../context/ProgramDetailContext.jsx";

import ProgramDetailSection from "../components/ProgramDetailSection.jsx";
import ProgramTitle from "../components/ProgramTitle.jsx";
import ProgramImages from "../components/ProgramImages.jsx";
import ProgramReserveBar from "../components/ProgramReserveBar.jsx";
import ProgramTabs from "../components/ProgramTabs.jsx";
import ProgramInfo from "../components/ProgramInfo.jsx";
import HotelInfo from "../components/details/HotelInfo.jsx";
import RoomList from "../components/details/RoomList.jsx";
import OfficeList from "../components/details/OfficeList.jsx";
import ActivityInfo from "../components/details/ActivityInfo.jsx";

function ProgramDetailBody() {
    const { loading, error } = useProgramDetail();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>프로그램을 불러오지 못했어요.</div>;

    return (
        <ProgramDetailSection>
            <ProgramTitle />
            <ProgramImages />
            <ProgramReserveBar />
            <ProgramTabs />

            <section id="program-info">
                <ProgramInfo />
            </section>

            <section id="hotel-info">
                <HotelInfo />
            </section>

            <RoomList />

            <section id="office-info">
                <OfficeList />
            </section>

            <section id="activity-info">
                <ActivityInfo />
            </section>

        </ProgramDetailSection>
    );
}

export default function ProgramDetailPage() {
    return (
        <PageLayout>
            <ProgramDetailProvider>
                <ProgramDetailBody />
            </ProgramDetailProvider>
        </PageLayout>
    );
}
