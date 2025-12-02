import PageLayout from "../layout/PageLayout";
import FloatingButtons from "../components/Common/FloatingButtons.jsx";
import ProgramTitle from "../components/Program/ProgramTitle.jsx";
import ProgramImages from "../components/Program/ProgramImages.jsx";
import ProgramReserveBar from "../components/Program/ProgramReserveBar.jsx";
import ProgramTabs from "../components/Program/ProgramTabs.jsx";
import ProgramInfo from "../components/Program/ProgramInfo.jsx";
import HotelInfo from "../components/ProgramDetails/HotelInfo.jsx";
import RoomList from "../components/ProgramDetails/RoomList.jsx";
import OfficeList from "../components/OfficeList/OfficeList.jsx";
import ActivityInfo from "../components/ActivityInfo/ActivityInfo.jsx";


export default function ProgramDetailPage() {
  const mainImage = "/public/ac95ce1d-57d6-4862-9e4e-fabfadd1e5a2.png";
  const subImages = [
    "/public/a161ab83-1b52-4475-b7e3-f75afb932943.png",
    "/public/c7209850-7773-481f-af51-511736fcf47d.png",
    "public/db333417-b310-4ba1-ac03-33cd2b71f553.png",
    "public/db333417-b310-4ba1-ac03-33cd2b71f553.png",
  ];

    return (
        <PageLayout>
            <ProgramTitle title="부산 영도 워케이션"/>
            <ProgramImages main={mainImage} subs={subImages}/>
            <ProgramReserveBar/>
            <ProgramTabs/>
            <ProgramInfo/>
            <HotelInfo/>
            <RoomList/>
            <OfficeList/>
            <ActivityInfo/>
            <FloatingButtons/>
        </PageLayout>
    );
}
