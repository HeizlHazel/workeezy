import PageLayout from "../layout/PageLayout";
import FloatingButtons from "../components/FloatingButtons/FloatingButtons";
import ProgramTitle from "../components/ProgramTitle/ProgramTitle.jsx";
import ProgramImages from "../components/ProgramImages/ProgramImages.jsx";
import ProgramReserveBar from "../components/ProgramReserveBar/ProgramReserveBar.jsx";
import ProgramTabs from "../components/ProgramTabs/ProgramTabs.jsx";
import ProgramInfo from "../components/ProgramInfo/ProgramInfo.jsx";
import HotelInfo from "../components/HotelInfo/HotelInfo.jsx";
import RoomList from "../components/RoomList/RoomList.jsx";
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
