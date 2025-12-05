package com.together.workeezy.reservation.controller;

import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations") // 기본 url
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /** 🧾 예약 생성 */
    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody ReservationCreateDto dto,
            Authentication authentication) {


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔥 현재 인증 정보: " + auth);
        System.out.println("🔥 권한 목록: " + auth.getAuthorities());

        System.out.println("🚀 예약 요청 도착");
        System.out.println("👤 사용자: " + authentication.getName());
        System.out.println("📦 DTO: " + dto);


        // 개별 필드 확인 로그 추가
        System.out.println("🧾 userName = " + dto.getUserName());
        System.out.println("🏢 company = " + dto.getCompany());
        System.out.println("📞 phone = " + dto.getPhone());
        System.out.println("📧 email = " + dto.getEmail());
        System.out.println("📅 startDate = " + dto.getStartDate());
        System.out.println("📅 endDate = " + dto.getEndDate());
        System.out.println("👥 peopleCount = " + dto.getPeopleCount());
        System.out.println("🏠 placeName = " + dto.getPlaceName());
        System.out.println("🏡 roomType = " + dto.getRoomType());
        System.out.println("🎯 programId = " + dto.getProgramId());
        System.out.println("🎯 programTitle = " + dto.getProgramTitle());


        try {
            reservationService.createNewReservation(dto, authentication.getName());
            return ResponseEntity.ok("예약 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("예약 실패: " + e.getMessage());
        }
    }
}
