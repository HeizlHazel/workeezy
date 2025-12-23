import { useEffect, useState } from "react";
import { fetchProgramDetail } from "./useProgramDetailApi.js";

export default function useProgramDetailState(programId) {
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchProgramDetail(programId);
                if (!cancelled) setProgram(data);
            } catch (e) {
                console.error("프로그램 불러오기 실패:", e);
                if (!cancelled) setError(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (programId) run();

        return () => {
            cancelled = true;
        };
    }, [programId]);

    return { program, setProgram, loading, error };
}
