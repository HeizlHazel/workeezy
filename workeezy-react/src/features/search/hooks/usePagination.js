import { useMemo, useState } from "react";

export default function usePagination(list, pageSize = 6) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(list.length / pageSize);
    const start = (currentPage - 1) * pageSize;

    const paginatedList = useMemo(
        () => list.slice(start, start + pageSize),
        [list, start, pageSize]
    );

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedList,
        isEmpty: paginatedList.length === 0,
    };
}
