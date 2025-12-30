import React, { useEffect, useState } from "react";
import "./AdminReservationList.css";
import Pagination from "../../../../shared/common/Pagination";
import ReservationStatusButton from "../ReservationStatusButton.jsx";
import axios from "../../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminReservationList() {
  const [reservations, setReservations] = useState([]); // 예약 목록
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [filters, setFilters] = useState({
    status: "",
    keyword: "",
  });

  const navigate = useNavigate();

  // page/filters 바뀔 때마다 목록 재조회
  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/admin/reservations", {
        params: {
          page: page - 1,
          status: filters.status || null,
          keyword: filters.keyword || null,
        },
      });

      setReservations(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("관리자 예약 조회 실패", error);
    }
  };

  return (
    <div className="admin-reservation-list">
      <h2 className="list-title">관리자 예약 조회</h2>

      {/* 필터 영역 */}
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">예약 상태</option>
          <option value="waiting_payment">예약 신청</option>
          <option value="approved">승인 완료</option>
          <option value="rejected">승인 거절</option>
          <option value="confirmed">예약 확정</option>
          <option value="cancel_requested">취소 요청</option>
          <option value="cancelled">취소 완료</option>
        </select>

        <input
          type="text"
          placeholder="프로그램명 / 예약자 검색"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
      </div>

      {/* 목록 테이블 */}
      <table className="reservation-table">
        <thead>
          <tr>
            <th>
              <span className="th-label">예약 번호</span>
            </th>
            <th>
              <span className="th-label">프로그램명</span>
            </th>
            <th>
              <span className="th-label">예약자</span>
            </th>
            <th>
              <span className="th-label">예약 신청일</span>
            </th>
            <th>
              <span className="th-label">예약 상태</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr
              key={r.id}
              className="clickable-row"
              onClick={() => navigate(`/admin/reservations/${r.id}`)}
            >
              <td>{r.reservationNo}</td>
              <td>{r.programTitle}</td>
              <td>{r.userName}</td>
              <td>
                {new Date(r.createdDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="status-td">
                <div className="status-cell">
                  <ReservationStatusButton status={r.status} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
