package com.together.workeezy.reservation.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationCreateDto {
    private Long programId;

    private String programTitle; // 임시저장용 제목

    private String userName;
    private String company;
    private String phone;
    private String email;

    private LocalDate startDate;
    private LocalDate endDate;
    private int peopleCount;

    private String officeName; // 오피스명
    private Long officeId;
    private String roomType; // 문자열로 enum 매칭
    private Long roomId;

}
