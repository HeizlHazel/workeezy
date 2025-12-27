package com.together.workeezy.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.together.workeezy.reservation.enums.ReservationStatus;
import com.together.workeezy.program.program.domain.model.entity.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReservationResponseDto {
    private long id;
    private String reservationNo;  // 예약번호 (ex: 20251212-000001)
    private ReservationStatus status;             // 예약상태

    private String userName;
    private String company;
    private String phone;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;       // 시작일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;         // 종료일

    private String programTitle;       // 워케이션 프로그램명
    private long programId;
    private String stayName;           // 숙소명
    private String officeName;         // 오피스명 (null 가능)
    private Long roomId;
    private RoomType roomType;           // 룸타입

    private Long totalPrice;        // 총 가격
    private Integer peopleCount;       // 인원수

    private String rejectReason;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;

    private String placePhoto1;
    private String placePhoto2;
    private String placePhoto3;

}
