package com.together.workeezy.reservation.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationCreateDto {
    private String userName;
    private String company;
    private String phone;
    private String email;

    private LocalDate startDate;
    private LocalDate endDate;
    private int peopleCount;

    private String placeName;
    private String roomType;

    private Long programId;
    private String programTitle;
}
