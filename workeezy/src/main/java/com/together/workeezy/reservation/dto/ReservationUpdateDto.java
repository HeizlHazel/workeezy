package com.together.workeezy.reservation.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationUpdateDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long roomId;
    private Long officeId;
    private Integer peopleCount;
}
