import React, { useEffect, useState } from "react";
import "./AdminReservationList.css";
import Pagination from "./../../../shared/common/Pagination";

export default function AdminReservationList() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    keyword: "",
  });

  useEffect(() => {
    fetchReservations();
  }, [page, filters]);

  // 🧩 목데이터로 리스트 생성
  const fetchReservations = async () => {
    // 서버 대신 임시 데이터
    const mockData = [
      {
        id: 1,
        reservationNo: "R20251208-001",
        programTitle: "제주 워케이션 패키지",
        userName: "홍길동",
        status: "PENDING",
        paymentStatus: "WAITING",
      },
      {
        id: 2,
        reservationNo: "R20251208-002",
        programTitle: "부산 오션뷰 오피스",
        userName: "김민수",
        status: "CONFIRMED",
        paymentStatus: "DONE",
      },
      {
        id: 3,
        reservationNo: "R20251208-003",
        programTitle: "강릉 워케이션 3박 4일",
        userName: "이서연",
        status: "CANCELLED",
        paymentStatus: "WAITING",
      },
    ];

    // 임시로 0.5초 지연 효과 (로딩 테스트용)
    await new Promise((r) => setTimeout(r, 500));

    setReservations(mockData);
    setTotalPages(1);
  };

  return (
    <div className="admin-reservation-list">
      <h2>관리자 예약 조회</h2>

      {/* 🔍 필터 영역 */}
      <div className="filters">
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">예약 상태</option>
          <option value="PENDING">대기</option>
          <option value="CONFIRMED">확정</option>
          <option value="CANCELLED">취소</option>
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, paymentStatus: e.target.value })
          }
        >
          <option value="">결제 상태</option>
          <option value="WAITING">결제 대기</option>
          <option value="DONE">결제 완료</option>
        </select>

        <input
          type="text"
          placeholder="프로그램명 / 예약자 검색"
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
      </div>

      {/* 📋 목록 테이블 */}
      <table className="reservation-table">
        <thead>
          <tr>
            <th>예약 번호</th>
            <th>프로그램명</th>
            <th>예약자</th>
            <th>예약 상태</th>
            <th>결제 상태</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.reservationNo}</td>
              <td>{r.programTitle}</td>
              <td>{r.userName}</td>
              <td>{r.status}</td>
              <td>{r.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
