package com.together.workeezy.reservation.service;

import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.AdminReservationDetailDto;
import com.together.workeezy.reservation.dto.AdminReservationListDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReservationService {

    private final ReservationRepository reservationRepository;

//    public Page<AdminReservationListDto> getAdminReservationLists(
//            int page,
//            ReservationStatus status,
//            String keyword
//    ) {
//        Pageable pageable = PageRequest.of(page, 5, Sort.by("id").descending());
//
//        Page<Reservation> result =
//                reservationRepository.findAdminReservations(status, keyword, pageable);
//
//        return result.map(r -> new AdminReservationListDto(
//                r.getId(),
//                r.getReservationNo(),
//                r.getProgram().getTitle(),
//                r.getUser().getUserName(),
//                r.getStatus()
//        ));
//    }

    // 관리자 - 전체 유저 예약 리스트로 조회
    public Page<AdminReservationListDto> getAdminReservationLists(
            int page,
            ReservationStatus status,
            String keyword
    ) {
        Pageable pageable = PageRequest.of(page, 5, Sort.by("id").descending());
        return reservationRepository.findAdminReservationListDtos(status, keyword, pageable);
    }

//    // 관리자 - 유저 예약 상세 조회
//    public AdminReservationDetailDto getReservationDetail(Long reservationId) {
//
//        Reservation r = reservationRepository
//                .findAdminReservationDetail(reservationId)
//                .orElseThrow(() ->
//                        new IllegalArgumentException("존재하지 않는 예약입니다.")
//                );
//
//        AdminReservationDetailDto dto = new AdminReservationDetailDto();
//
//        /* ===== 식별 / 상태 ===== */
//        dto.setReservationId(r.getId());
//        dto.setReservationNo(r.getReservationNo());
//        dto.setStatus(r.getStatus());
//
//        /* ===== 프로그램 ===== */
//        dto.setProgramTitle(r.getProgram().getTitle());
//
//        /* ===== 예약자 정보 ===== */
//        dto.setUserName(r.getUser().getUserName());
//        dto.setCompany(r.getUser().getCompany());
//        dto.setPhone(r.getUser().getPhone());
//        dto.setEmail(r.getUser().getEmail());
//
//        /* ===== 예약 정보 ===== */
//        dto.setStartDate(r.getStartDate());
//        dto.setEndDate(r.getEndDate());
//        dto.setPeopleCount(r.getPeopleCount());
//
//        /* ===== 숙소 / 룸 ===== */
//        dto.setStayName(
//                r.getStay() != null ? r.getStay().getName() : null
//        );
//        dto.setRoomType(
//                r.getRoom() != null ? r.getRoom().getRoomType().name() : null
//        );
//
//        /* ===== 선택 정보 ===== */
//        dto.setOfficeName(
//                extractOfficeName(r.getProgram())
//        );
//
//        return dto;
//    }
//
//    private String extractOfficeName(Program program) {
//        if (program == null || program.getPlaces() == null) {
//            return null;
//        }
//
//        return program.getPlaces().stream()
//                .filter(place -> place.getPlaceType() == PlaceType.office)
//                .findFirst()
//                .map(Place::getName)
//                .orElse(null);
//    }

    // 예약 상세 조회
    @Transactional(readOnly = true)
    public AdminReservationDetailDto getReservationDetail(Long reservationId) {

        return reservationRepository
                .findAdminReservationDetailDto(reservationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 예약입니다.")
                );
    }

    // 예약 승인 (waiting_payment → approved)
    public void approveReservation(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        reservation.approve();
    }

    // 예약 반려 (waiting_payment → rejected)
    public void rejectReservation(Long reservationId, String reason) {
        Reservation reservation = getReservation(reservationId);
        reservation.reject(reason);
    }

    // 취소승인 (cancel_requested → cancelled)
    public void approveCancel(Long reservationId) {
        Reservation reservation = getReservation(reservationId);
        reservation.approveCancel();
    }

    // 취소 반려 (cancel_requested → confirmed)
    public void rejectCancel(Long reservationId, String reason) {
        Reservation reservation = getReservation(reservationId);
        reservation.rejectCancel(reason);
    }

    // 유효 예약 검증
    private Reservation getReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
    }



}
