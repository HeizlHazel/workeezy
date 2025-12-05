package com.together.workeezy.reservation.repository;

import com.together.workeezy.reservation.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation,String> {

    Optional<Object> findWithRoomType(Long reservationId);

}
