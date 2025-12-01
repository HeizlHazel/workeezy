package com.together.workeezy.reservation.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationCreateDto {
    private String userName;
    private String company;
    private String phone;
    private String email;
    private LocalDateTime startDate;
    private LocalDateTime  endDate;
    private String officeName;
    private String roomType;
    private int peopleCount;
}
