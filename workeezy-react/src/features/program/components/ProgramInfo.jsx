import "./ProgramInfo.css";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";

export default function ProgramInfo() {
    const { programInfo } = useProgramDetail();

    return (
        <section className="pd-section">
            <h3>프로그램 정보</h3>
            <p style={{ whiteSpace: "pre-line" }}>{programInfo}</p>
        </section>
    );
}
