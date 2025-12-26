package com.together.workeezy.reservation.dto;

import com.together.workeezy.reservation.enums.ReservationStatus;
import lombok.Getter;

@Getter
public class AdminReservationListDto {

    private Long id;
    private String reservationNo;
    private String programTitle;
    private String userName;
    private ReservationStatus status;

    public AdminReservationListDto(
            Long id,
            String reservationNo,
            String programTitle,
            String userName,
            ReservationStatus status
    ) {
        this.id = id;
        this.reservationNo = reservationNo;
        this.programTitle = programTitle;
        this.userName = userName;
        this.status = status;
    }
}
