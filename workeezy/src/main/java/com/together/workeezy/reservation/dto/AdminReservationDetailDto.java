package com.together.workeezy.reservation.dto;

import com.together.workeezy.program.program.domain.model.entity.RoomType;
import com.together.workeezy.reservation.enums.ReservationStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AdminReservationDetailDto {

    private Long reservationId;
    private String reservationNo;
    private ReservationStatus status;
    private String programTitle;
    private String userName;
    private String company;
    private String phone;
    private String email;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int peopleCount;
    private String stayName;
    private RoomType roomType;
    private String officeName;

    public AdminReservationDetailDto(
            Long reservationId,
            String reservationNo,
            ReservationStatus status,
            String programTitle, //
            String userName,//
            String company,//
            String phone, //
            String email, //
            LocalDateTime startDate,
            LocalDateTime endDate,
            int peopleCount,
            String stayName,
            RoomType roomType,
            String officeName
            // 프로그램 가격?
    ) {
        this.reservationId = reservationId;
        this.reservationNo = reservationNo;
        this.status = status;
        this.programTitle = programTitle;
        this.userName = userName;
        this.company = company;
        this.phone = phone;
        this.email = email;
        this.startDate = startDate;
        this.endDate = endDate;
        this.peopleCount = peopleCount;
        this.stayName = stayName;
        this.roomType = roomType;
        this.officeName = officeName;
    }
}



