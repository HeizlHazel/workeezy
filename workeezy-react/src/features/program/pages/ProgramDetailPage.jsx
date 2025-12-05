import FloatingButtons from "../components/Common/FloatingButtons.jsx";
import ProgramTitle from "../components/Program/ProgramTitle.jsx";
import ProgramImages from "../components/Program/ProgramImages.jsx";
import ProgramReserveBar from "../components/Program/ProgramReserveBar.jsx";
import ProgramTabs from "../components/Program/ProgramTabs.jsx";
import ProgramInfo from "../components/Program/ProgramInfo.jsx";
import RoomList from "../components/ProgramDetails/RoomList.jsx";
import OfficeList from "../components/ProgramDetails/OfficeList.jsx";
import ActivityInfo from "../components/ProgramDetails/ActivityInfo.jsx";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/publicApi.js";
import PageLayout from "../Layout/PageLayout.jsx";
import HotelInfo from "../components/ProgramDetails/HotelInfo.jsx"; // axios 설정한 파일

export default function ProgramDetailPage() {
    const { id } = useParams();
    const [program, setProgram] = useState(null);

    useEffect(() => {
        api.get(`/api/programs/${id}`)
            .then((res) => setProgram(res.data))
            .catch((err) => console.log(err));
    }, [id]);

    if (!program) return <div>Loading...</div>;
    console.log("MAIN IMAGE:", program.mainImage);
    console.log("SUBS:", program.subImages);
    return (
        <PageLayout>

            {/* 1) 제목 */}
            <ProgramTitle title={program.title} />

            {/* 2) 사진들 */}
            <ProgramImages
                mainImage={program.mainImage}
                subImages={program.subImages}
            />

            {/* 3) 예약바 */}
            <ProgramReserveBar />

            {/* 4) 탭 */}
            <ProgramTabs />

            {/* 5) 프로그램 설명 */}
            <ProgramInfo info={program.programInfo} />

            {/* 6) 숙소 정보 */}
            <HotelInfo hotel={program.hotel} />

            {/* 7) 방 리스트 — 숙소의 rooms */}
            <RoomList rooms={program.hotel?.rooms ?? []} />

            {/* 8) 오피스 목록 */}
            <OfficeList offices={program.offices} />

            {/* 9) 액티비티 목록 */}
            <ActivityInfo attractions={program.attractions} />

            {/* 10) Floating 버튼 */}
            <FloatingButtons />
        </PageLayout>
    );
}


