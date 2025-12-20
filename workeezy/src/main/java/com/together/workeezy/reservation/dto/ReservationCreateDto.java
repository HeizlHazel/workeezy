package com.together.workeezy.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

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

<<<<<<< HEAD
    private LocalDateTime startDate;
    private LocalDateTime endDate;
=======
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime  startDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime  endDate;
>>>>>>> feat/payment-create
    private int peopleCount;

    private String officeName; // 오피스명
    private Long officeId;
    private String roomType; // 문자열로 enum 매칭
    private Long roomId;

    private Long stayId;
    private String stayName; // 조회용

    private String draftKey;

}
