package com.together.workeezy.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.together.workeezy.reservation.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AdminReservationDetailDto {

    /* ===== 식별 / 상태 ===== */
    private Long reservationId;
    private String reservationNo;
    private ReservationStatus status;

    /* ===== 프로그램 ===== */
    private String programTitle;

    /* ===== 예약자 정보 ===== */
    private String userName;
    private String company;
    private String phone;
    private String email;

    /* ===== 예약 정보 ===== */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime  endDate;
    private int peopleCount;

    /* ===== 숙소 / 룸 ===== */
    private String stayName;
    private String roomType;

    /* ===== 선택 정보 ===== */
    private String officeName; // 없으면 null

}
