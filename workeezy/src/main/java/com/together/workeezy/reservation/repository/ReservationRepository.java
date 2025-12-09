package com.together.workeezy.reservation.repository;

import com.together.workeezy.reservation.Reservation;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation,String> {

    // 오늘 날짜(yyyyMMdd)로 시작하는 예약번호 중 가장 큰 값 가져오기
    @Query("""
        SELECT r.reservationNo 
        FROM Reservation r 
        WHERE r.reservationNo LIKE CONCAT(:datePrefix, '%') 
        ORDER BY r.reservationNo DESC 
        LIMIT 1
    """)
    String findLatestReservationNoByDate(@Param("datePrefix") String datePrefix);
}
