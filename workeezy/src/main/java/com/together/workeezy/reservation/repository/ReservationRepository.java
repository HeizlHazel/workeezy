package com.together.workeezy.reservation.repository;

import com.together.workeezy.reservation.Reservation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 오늘 날짜(yyyyMMdd)로 시작하는 예약번호 중 가장 큰 값 1개 조회
    @Query("""
    SELECT r.reservationNo
    FROM Reservation r
    WHERE r.reservationNo LIKE CONCAT(:datePrefix, '%')
    ORDER BY r.reservationNo DESC
""")
    List<String> findLatestReservationNoByDate(@Param("datePrefix") String datePrefix, Pageable pageable);

}
