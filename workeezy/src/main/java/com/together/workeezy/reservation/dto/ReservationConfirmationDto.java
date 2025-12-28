package com.together.workeezy.reservation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.together.workeezy.program.program.domain.model.entity.RoomType;
import com.together.workeezy.reservation.domain.Reservation;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReservationConfirmationDto {

    private Long reservationId;
    private String reservationNo;
    private String status;

    private String programTitle;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;

    // 유저 정보
    private String userName;
    private String phone;
    private String email;

    // 장소 정보
    private String stayName;
    private String officeName;
    private String roomType;

    private Integer peopleCount;

    // 결제 정보
    private Long totalPrice;

    // confirm_pdf_key 존재 여부
    private boolean pdfReady;

    public static ReservationConfirmationDto from(Reservation r) {
        return new ReservationConfirmationDto(
                r.getId(),
                r.getReservationNo(),
                r.getStatus().name(),

                r.getProgram().getTitle(),

                r.getStartDate(),
                r.getEndDate(),
                r.getUser().getUserName(),
                r.getUser().getPhone(),
                r.getUser().getEmail(),

                r.getStay() != null ? r.getStay().getName() : null,
                r.getOffice() != null ? r.getOffice().getName() : null,
                r.getRoom() != null ? r.getRoom().getRoomType().name() : null,

                r.getPeopleCount(),
                r.getTotalPrice(),

                r.getConfirmPdfKey() != null && !r.getConfirmPdfKey().isBlank()
        );
    }
}
