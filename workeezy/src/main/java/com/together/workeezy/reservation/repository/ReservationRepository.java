package com.together.workeezy.reservation.repository;

import com.together.workeezy.reservation.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation,String> {
}
