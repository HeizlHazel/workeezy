import React from "react";
import "./Pagination.css";

export default function Pagination({currentPage, totalPages, onPageChange}) {
    const pageNumbers = [];

    // 1) 첫 페이지는 항상 표시
    if (totalPages >= 1) pageNumbers.push(1);

    // 2) "앞쪽 ... 표시"
    if (currentPage > 4) {
        pageNumbers.push("...");
    }

    // 3) 현재 페이지 기준 앞뒤로 -2 ~ +2 표시
    for (let p = currentPage - 2; p <= currentPage + 2; p++) {
        if (p > 1 && p < totalPages) {
            pageNumbers.push(p);
        }
    }

    // 4) "뒤쪽 ... 표시"
    if (currentPage < totalPages - 3) {
        pageNumbers.push("...");
    }

    // 5) 마지막 페이지는 항상 표시 (단 1페이지가 아닌 경우)
    if (totalPages > 1) pageNumbers.push(totalPages);

    return (
        <div className="pagination">

            {/* Previous 버튼 */}
            <span
                className={`prev ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            >
                ← Previous
            </span>

            {/* 페이지 번호들 */}
            {pageNumbers.map((page, idx) => (
                page === "..." ? (
                    <span key={idx} className="dots">...</span>
                ) : (
                    <span
                        key={idx}
                        className={`page ${page === currentPage ? "active" : ""}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </span>
                )
            ))}

            {/* Next 버튼 */}
            <span
                className={`next ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() =>
                    currentPage < totalPages && onPageChange(currentPage + 1)
                }
            >
                Next →
            </span>

        </div>
    );
}