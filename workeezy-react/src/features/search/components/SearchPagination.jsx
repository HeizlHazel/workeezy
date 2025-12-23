import Pagination from "../../../shared/common/Pagination.jsx";
import { useSearch } from "../context/SearchContext.jsx";

export default function SearchPagination() {
    const { totalPages, currentPage, setCurrentPage, viewMode } = useSearch();

    if (viewMode !== "list") return null;
    if (totalPages <= 1) return null;

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
    );
}
