package com.together.workeezy.reservation.service;

import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.entity.Room;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.search.repository.RoomRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    // 동시 요청 방지를 위해 synchronized 추가 (멀티유저 환경 대비)
    public synchronized Reservation createNewReservation(ReservationCreateDto dto, String email) {

        // 오늘 날짜 문자열 (예: 20251209)
        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        // 오늘 날짜로 시작하는 예약번호 중 가장 마지막 값 1개 조회1
        Pageable limitOne = PageRequest.of(0, 1);
        List<String> latestList = reservationRepository.findLatestReservationNoByDate(today, limitOne);
        String latestNo = latestList.isEmpty() ? null : latestList.get(0);

        long newSeq = 1L;
        if (latestNo != null) {
            // latestNo = "20251209-000000008"
            String[] parts = latestNo.split("-");
            if (parts.length == 2) {
                newSeq = Long.parseLong(parts[1]) + 1;
            }
        }

        // 새로운 예약번호 생성 (예: 20251209-000000009)
        String newReservationNo = String.format("%s-%09d", today, newSeq);

        // 관련 엔티티 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 유저가 존재하지 않습니다."));

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 프로그램이 존재하지 않습니다."));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 룸이 존재하지 않습니다. roomId=" + dto.getRoomId()));

        // 총 금액 계산 (프로그램 가격 * 인원수)
        Integer basePrice = program.getProgramPrice();
        Long totalPrice = (long) (basePrice * dto.getPeopleCount());

        // 예약 엔티티 생성
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProgram(program);
        reservation.setRoom(room);
        reservation.setReservationNo(newReservationNo);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setPeopleCount(dto.getPeopleCount());
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus(ReservationStatus.waiting_payment);

        return reservationRepository.save(reservation);
    }
}
