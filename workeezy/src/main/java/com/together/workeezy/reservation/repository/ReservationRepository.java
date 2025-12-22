package com.together.workeezy.reservation.repository;

import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // ***** 오늘 날짜(yyyyMMdd)로 시작하는 예약번호 중 가장 큰 값 1개 조회 ***** //
    @Query("""
    SELECT r.reservationNo
    FROM Reservation r
    WHERE r.reservationNo LIKE CONCAT(:datePrefix, '%')
    ORDER BY r.reservationNo DESC
""")
    List<String> findLatestReservationNoByDate(@Param("datePrefix") String datePrefix, Pageable pageable);
    List<Reservation> findByUserId(Long userId);

    // ***** 해당 사용자 예약 전체 조회 ***** //
    @Query("""
select new com.together.workeezy.reservation.dto.ReservationResponseDto(
    r.id,
    r.reservationNo,
    r.status,
    u.userName,
    u.company,
    u.phone,
    r.startDate,
    r.endDate,
    p.title,
    p.id,
    s.name,
    o.name,
    rm.id,
    rm.roomType,
    r.totalPrice,
    r.peopleCount,
    r.rejectReason
)
from Reservation r
join r.user u
join r.program p
join r.stay s
join r.office o
join r.room rm
where r.user.id = :userId
order by r.createdDate desc
""")
    List<ReservationResponseDto> findMyReservationDtos(@Param("userId") Long userId);

    // ***** 사용자 단건 조회 ***** //
    @Query("""
select new com.together.workeezy.reservation.dto.ReservationResponseDto(
    r.id,
    r.reservationNo,
    r.status,
    u.userName,
    u.company,
    u.phone,
    r.startDate,
    r.endDate,
    p.title,
    p.id,
    s.name,
    o.name,
    rm.id,
    rm.roomType,
    r.totalPrice,
    r.peopleCount,
    r.rejectReason
)
from Reservation r
join r.user u
join r.program p
join r.stay s
join r.office o
join r.room rm
where r.id = :reservationId
  and u.email = :email
""")
    Optional<ReservationResponseDto> findMyReservationDto(
            @Param("reservationId") Long reservationId,
            @Param("email") String email
    );


    // 관리자 예약 조회 (Page + left join)
    @Query("""
        select r
        from Reservation r
          left join r.user u
          left join r.program p
        where (:status is null or r.status = :status)
          and (
               :keyword is null
               or :keyword = ''
               or u.userName like concat('%', :keyword, '%')
               or p.title like concat('%', :keyword, '%')
          )
        order by r.id desc
    """)
    Page<Reservation> findAdminReservations(
            @Param("status") ReservationStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    // 관리자 예약 상세 조회
    @Query("""
        select r
        from Reservation r
          join fetch r.program p
          join fetch r.user u
          left join fetch r.stay s
          left join fetch r.room rm
          left join fetch p.places pl
        where r.id = :reservationId
    """)
    Optional<Reservation> findAdminReservationDetail(
            @Param("reservationId") Long reservationId
    );

}
