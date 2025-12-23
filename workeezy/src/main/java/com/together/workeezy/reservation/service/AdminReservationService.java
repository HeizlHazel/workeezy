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

    @Transactional(readOnly = true)
    public AdminReservationDetailDto getReservationDetail(Long reservationId) {

        return reservationRepository
                .findAdminReservationDetailDto(reservationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 예약입니다.")
                );
    }

    // 예약 승인
    @Transactional
    public void approveReservation(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        // 상태 검증 (이거 진짜 중요)
        if (reservation.getStatus() != ReservationStatus.waiting_payment) {
            throw new IllegalStateException("결제 대기 상태에서만 승인할 수 있습니다.");
        }

        // 상태 변경
        reservation.setStatus(ReservationStatus.approved);
        // save 안 해도 됨 (dirty checking)
    }


    // 예약 반송
    @Transactional
    public void rejectReservation(Long reservationId, String reason) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("예약을 찾을 수 없습니다.")
                );
        
        // 예약 반송은 waiting_payment 만
        if (reservation.getStatus() != ReservationStatus.waiting_payment) {
            throw new IllegalStateException("결제 대기 상태에서만 예약을 반려할 수 있습니다.");
        }


        reservation.setStatus(ReservationStatus.rejected);

         //반송 사유 저장 (필드 있을 경우)
        reservation.setRejectReason(reason);
    }


    // 취소요청 - 취소 승인
    @Transactional
    public void approveCancel(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (reservation.getStatus() != ReservationStatus.cancel_requested) {
            throw new IllegalStateException("취소 요청 상태에서만 취소 승인할 수 있습니다.");
        }

        reservation.setStatus(ReservationStatus.cancelled);
    }

    // 취소 거절
    @Transactional
    public void rejectCancel(Long reservationId, String reason) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (reservation.getStatus() != ReservationStatus.cancel_requested) {
            throw new IllegalStateException("취소 요청 상태에서만 취소 반려할 수 있습니다.");
        }

        // 취소 반려 = 예약은 다시 유효
        reservation.setStatus(ReservationStatus.confirmed);
        reservation.setRejectReason(reason);
    }



}
