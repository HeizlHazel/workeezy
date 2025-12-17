package com.together.workeezy.reservation.service;

import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.entity.Room;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.dto.ReservationResponseDto;
import com.together.workeezy.reservation.dto.ReservationUpdateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.search.repository.RoomRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import com.together.workeezy.program.entity.Place;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PlaceRepository placeRepository;

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
        reservation.setStay(room.getPlace());
        reservation.setReservationNo(newReservationNo);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setPeopleCount(dto.getPeopleCount());
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus(ReservationStatus.waiting_payment);

        return reservationRepository.save(reservation);
    }

    /*  내 예약 목록 조회 (컨트롤러에서 /me로 호출) */
    @Transactional(readOnly = true) // 쓰기 감지 안해서 속도 향상
    public List<ReservationResponseDto> getMyReservations(String email) { // 예약 목록을 담은 DTO 리스트
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 유저가 존재하지 않습니다."));

        // 예약 + 프로그램 + 룸 + 스테이 하나의 sql로 묶어서 가지고 옴. n+1 방지
        List<Reservation> reservations = reservationRepository.findByUserIdWithJoins(user.getId());

        // db에서 가지고 온 예약들 프론트 용으로 바꾸기
        return reservations.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    //  Entity → DTO 변환기 (Service 내부 전용)
    private ReservationResponseDto mapToResponseDto(Reservation r) { // 예약 1개
        // 해당 예약이 어떤 워케이션 프로그램인지
        Program p = r.getProgram();

        // 예약이 참조하고 있는 place가 있으면 그 숙소의 이름을 가지고 오고 아님 null
        String stayName = (r.getStay() != null) ? r.getStay().getName() : null;

        // 예외적으로 예약의 stay가 없다면 Program.stayId로 폴백
        if (stayName == null && p != null && p.getStayId() != null) {
            stayName = placeRepository.findById(p.getStayId())
                    .map(Place::getName)
                    .orElse(null);
        }

        // 오피스명: Program.officeId → Place.name
        String officeName = null;
        if (p != null && p.getOfficeId() != null) {
            Place office = placeRepository.findById(p.getOfficeId()).orElse(null);

            // 임시 방어: 아직 데이터 안 맞을 때만
            if (office != null
                    && office.getProgram() != null
                    // 목데이터 넣으면 아래 삭제
                    && office.getProgram().getId().equals(p.getId()))  { 

                officeName = office.getName();
            }
        }


        return new ReservationResponseDto(
                r.getId(),

                r.getReservationNo(),
                r.getStatus().name(),
                r.getUser().getUserName(),
                r.getUser().getCompany(),
                r.getUser().getPhone(),
                r.getStartDate(),
                r.getEndDate(),
                (p != null ? p.getTitle() : null),
                p != null ? p.getId() : null,
                stayName,
                officeName,
                (r.getRoom() != null && r.getRoom().getRoomType() != null) ? r.getRoom().getRoomType().name() : null,
                r.getTotalPrice(),
                r.getPeopleCount()
        );
    }

    @Transactional(readOnly = true)
    public ReservationResponseDto getMyReservation(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("예약 없음"));

        // ⭐ 핵심: 내 예약인지 검증
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("본인 예약 아님");
        }

        return mapToResponseDto(reservation);
    }

    
    // 예약 수정
    @Transactional
    public void updateMyReservation(Long id, ReservationUpdateDto dto, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("예약 없음"));

        // ⭐ 핵심: 본인 예약 검증
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("본인 예약 아님");
        }

        // 🔒 상태별 수정 가능 조건 (필요하면)
        if (reservation.getStatus() != ReservationStatus.waiting_payment) {
            throw new IllegalStateException("이 상태에서는 수정 불가");
        }

        // 수정 가능한 필드만 변경
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setPeopleCount(dto.getPeopleCount());

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("룸 없음"));
        reservation.setRoom(room);

//        Place office = placeRepository.findById(dto.getOfficeId())
//                .orElseThrow(() -> new IllegalArgumentException("오피스 없음"));
//        reservation.setStay(office);


    }



}
