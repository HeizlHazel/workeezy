import { useState } from "react";

export default function useSearchViewMode() {
    const [viewMode, setViewMode] = useState("list");
    return { viewMode, setViewMode };
}
