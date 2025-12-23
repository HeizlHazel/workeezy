import "./ProgramTitle.css";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";

export default function ProgramTitle() {
    const { title } = useProgramDetail();
    return <h2 className="pd-title">{title}</h2>;
}
