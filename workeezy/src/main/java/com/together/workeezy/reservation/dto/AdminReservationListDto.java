package com.together.workeezy.reservation.dto;

import com.together.workeezy.reservation.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminReservationListDto {

    private Long id;
    private String reservationNo;
    private String programTitle;
    private String userName;
    private ReservationStatus status;
}
