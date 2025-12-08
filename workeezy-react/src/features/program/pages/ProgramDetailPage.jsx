import FloatingButtons from "../../../shared/common/FloatingButtons.jsx";
import ProgramTitle from "../components/ProgramTitle.jsx";
import ProgramImages from "../components/ProgramImages.jsx";
import ProgramReserveBar from "../components/ProgramReserveBar.jsx";
import ProgramTabs from "../components/ProgramTabs.jsx";
import ProgramInfo from "../components/ProgramInfo.jsx";
import RoomList from "../components/details/RoomList.jsx";
import OfficeList from "../components/details/OfficeList.jsx";
import ActivityInfo from "../components/details/ActivityInfo.jsx";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import PageLayout from "../../../Layout/PageLayout.jsx";
import HotelInfo from "../components/details/HotelInfo.jsx";

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
            <ProgramReserveBar
                rooms={program.hotel?.rooms ?? []}
                offices={program.offices ?? []}
                programId={program.id}
            />


            {/* 4) 탭 */}
            <ProgramTabs />

            {/* 5) 프로그램 설명 */}
            <ProgramInfo info={program.programInfo} />

            {/* 6) 숙소 정보 */}
            <HotelInfo hotel={program.hotel} />

            {/* 7) 방 리스트 — 숙소의 rooms */}
            <RoomList
                rooms={program.hotel?.rooms ?? []}
                photos={program.hotel ?? {}}
            />


            {/* 8) 오피스 목록 */}
            <OfficeList offices={program.offices} />


                {/* 9) 액티비티 목록 */}
            <ActivityInfo attractions={program.attractions} />

            {/* 10) Floating 버튼 */}
            <FloatingButtons />
        </PageLayout>
    );
}


