import { useParams } from "react-router-dom";

export default function useProgramId() {
    const { id } = useParams();
    return { programId: id };
}
