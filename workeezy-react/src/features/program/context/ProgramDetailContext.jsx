import { createContext, useContext, useMemo } from "react";
import useProgramId from "../hooks/useProgramId.js";
import useProgramDetailState from "../hooks/useProgramDetailState.js";

const ProgramDetailContext = createContext(null);

export function ProgramDetailProvider({ children }) {
    const { programId } = useProgramId();
    const { program, loading, error, setProgram } = useProgramDetailState(programId);

    const value = useMemo(
        () => ({
            programId,
            program,
            setProgram,
            loading,
            error,

            // ✅ derived (컴포넌트에서 편하게 쓰도록)
            title: program?.title ?? "",
            mainImage: program?.mainImage ?? null,
            subImages: program?.subImages ?? [],
            programInfo: program?.programInfo ?? "",
            hotel: program?.hotel ?? null,
            rooms: program?.hotel?.rooms ?? [],
            offices: program?.offices ?? [],
            attractions: program?.attractions ?? [],
        }),
        [programId, program, loading, error, setProgram]
    );

    return (
        <ProgramDetailContext.Provider value={value}>
            {children}
        </ProgramDetailContext.Provider>
    );
}

export function useProgramDetail() {
    const ctx = useContext(ProgramDetailContext);
    if (!ctx) throw new Error("useProgramDetail must be used within ProgramDetailProvider");
    return ctx;
}
