package com.together.workeezy.reservation.service;

import com.together.workeezy.reservation.domain.Reservation;
import com.together.workeezy.reservation.dto.ReservationConfirmationDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationConfirmationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    private final OpenPdfReservationConfirmationGenerator pdfGenerator;
    private final S3PdfStorage s3PdfStorage;

    /** 조회(미리보기 JSON) */
    @Transactional(readOnly = true)
    public ReservationConfirmationDto getPreview(Long reservationId, String email) {
        Reservation reservation = getOwnedReservation(reservationId, email);

        reservation.ensureConfirmed(); // 도메인 규칙

        return ReservationConfirmationDto.from(reservation);
    }

    /**
     * 생성/업데이트(재생성)
     * - 확정 상태만 가능
     * - S3 업로드(덮어쓰기 권장)
     * - confirmPdfKey 갱신
     */
    public void regenerate(Long reservationId, String email) {
        Reservation reservation = getOwnedReservation(reservationId, email);

        reservation.ensureConfirmed(); // 확정 상태만

        String key = buildKey(reservationId); // 덮어쓰기 1개 전략

        byte[] pdfBytes = pdfGenerator.generate(reservation);

        s3PdfStorage.uploadPdf(pdfBytes, key);

        reservation.updateConfirmPdfKey(key); // 도메인 변경
        // JPA dirty checking으로 DB 반영
    }

    /** 다운로드(PDF) */
    @Transactional(readOnly = true)
    public ResponseEntity<InputStreamResource> download(Long reservationId, String email) {
        Reservation reservation = getOwnedReservation(reservationId, email);

        reservation.ensureConfirmed();
        reservation.ensureHasConfirmPdf(); // pdfKey 없으면 예외

        InputStream is = s3PdfStorage.downloadPdf(reservation.getConfirmPdfKey());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reservation_" + reservationId + "_confirmation.pdf")
                .body(new InputStreamResource(is));
    }

    /** S3 key 규칙 */
    private String buildKey(Long reservationId) {
        return "reservations/" + reservationId + "/confirmation.pdf";
    }

    /** 본인 예약 검증 */
    private Reservation getOwnedReservation(Long reservationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 없음"));

        if (!reservation.isOwnedBy(user)) {
            throw new AccessDeniedException("본인 예약 아님");
        }
        return reservation;
    }

    public void regenerateByAdmin(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 없음"));

        reservation.ensureConfirmed();

        String key = buildKey(reservationId);
        byte[] pdfBytes = pdfGenerator.generate(reservation);
        s3PdfStorage.uploadPdf(pdfBytes, key);
        reservation.updateConfirmPdfKey(key);
    
        // 관리자 승인시
    //reservationConfirmationService.regenerateByAdmin(reservationId);
    }
}
