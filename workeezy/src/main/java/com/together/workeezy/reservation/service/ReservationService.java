package com.together.workeezy.reservation.service;

import com.together.workeezy.program.program.domain.model.entity.PlaceType;
import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.program.program.domain.model.entity.Room;
import com.together.workeezy.program.program.domain.repository.PlaceRepository;
import com.together.workeezy.program.program.domain.repository.ProgramRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.dto.ReservationResponseDto;
import com.together.workeezy.reservation.dto.ReservationUpdateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.search.domain.model.repository.RoomRepository;
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
import com.together.workeezy.program.program.domain.model.entity.Place;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PlaceRepository placeRepository;
    private final DraftRedisService draftRedisService;

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

        if (dto.getOfficeId() != null) {
            Place office = placeRepository.findById(dto.getOfficeId())
                    .orElseThrow(() -> new IllegalArgumentException("오피스 없음"));
            reservation.setOffice(office);
        }

        reservation.setReservationNo(newReservationNo);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setPeopleCount(dto.getPeopleCount());
        reservation.setTotalPrice(totalPrice);
        reservation.setStatus(ReservationStatus.waiting_payment);

        Reservation saved = reservationRepository.save(reservation);

        // 예약 저장 후 임시저장 삭제
        if (dto.getDraftKey() !=null && !dto.getDraftKey().isBlank()){
            draftRedisService.deleteDraft(dto.getDraftKey());
        }
        return saved;
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

        /* 후에 삭제
        // 예약이 참조하고 있는 place가 있으면 그 숙소의 이름을 가지고 오고 아님 null
        String stayName = (r.getStay() != null) ? r.getStay().getName() : null;
        // 예외적으로 예약의 stay가 없다면 Program.stayId로 폴백
        if (stayName == null && p != null && p.getStayId() != null) {
            stayName = placeRepository.findById(p.getStayId())
                    .map(Place::getName)
                    .orElse(null);
        }*/ 
        
        // 숙소명
        String stayName = r.getStay().getName();

        // 오피스명(선택)
        String officeName = (r.getOffice() != null)
                ? r.getOffice().getName()
                : null;


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
                r.getRoom().getId(),
                (r.getRoom() != null && r.getRoom().getRoomType() != null) ? r.getRoom().getRoomType().name() : null,
                r.getTotalPrice(),
                r.getPeopleCount(),
                r.getRejectReason()
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

        System.out.println("===== Reservation Entity =====");
        System.out.println("reservation.id = " + reservation.getId());
        System.out.println("reservation.room = " + reservation.getRoom());
        System.out.println("reservation.room.id = " + reservation.getRoom().getId());
        System.out.println("reservation.room.type = " + reservation.getRoom().getRoomType());
        System.out.println("==============================");


        return mapToResponseDto(reservation);
    }

    
    // 예약 수정
    @Transactional
    public void updateMyReservation(Long id, ReservationUpdateDto dto, String email) {

        Reservation reservation = getMyReservationOrThrow(id, email);

        // 상태 + 날짜 검증
        reservation.validateUpdatable();
        reservation.validateDate(dto.getStartDate(), dto.getEndDate());

        //  날짜 / 인원 변경
        reservation.changePeriod(dto.getStartDate(), dto.getEndDate());
        reservation.changePeopleCount(dto.getPeopleCount());

        // 룸 + 숙소 변경 (Service에서 조합 검증)
        Room room = getValidRoom(dto.getRoomId(), reservation.getProgram());
        reservation.changeRoom(room);

        // 금액 재계산
        reservation.recalculateTotalPrice();

    }

    // 예약 취소
    @Transactional
    public void cancelMyReservation(Long id, String email) {

        Reservation reservation = getMyReservationOrThrow(id, email);

        int diffDays =  reservation.daysUntilStart();

        if (!reservation.getStatus().canDirectCancel(diffDays)) {
            throw new IllegalStateException("이 상태에서는 취소 불가");
        }
        if (diffDays < 0) {
            throw new IllegalStateException("이미 시작된 예약은 취소 불가");
        }

        reservation.setStatus(ReservationStatus.cancelled);
    }


    // ============================================================================


    // 도메인 검증 + 조회 유틸 메서드 (가드 메서드)
    private Reservation getMyReservationOrThrow(Long reservationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약 없음"));

        if (!reservation.isOwnedBy(user)) {
            throw new AccessDeniedException("본인 예약 아님");
        }

        return reservation;
    }

    // 룸 검증
    private Room getValidRoom(Long roomId, Program program){
        Room room = roomRepository.findById(roomId)
                .orElseThrow(()-> new IllegalArgumentException("룸 없음"));

        Place stay = room.getPlace();

        if (stay.getPlaceType() != PlaceType.stay){
            throw new IllegalStateException("숙소 타입이 아닙니다.");
        }
        if (!stay.getProgram().getId().equals(program.getId())) {
            throw new IllegalStateException("프로그램에 속한 숙소의 룸이 아닙니다.");
        }
        return room;
    }

    /*
    // 오피스 검증
    private Place getValidOffice(Long officeId, Program program) {
        if (officeId == null) {
            return null;
        }

        Place office = placeRepository.findById(officeId)
                .orElseThrow(() -> new IllegalArgumentException("오피스 없음"));

        if (office.getPlaceType() != PlaceType.office) {
            throw new IllegalStateException("오피스 타입이 아닙니다.");
        }

        if (!office.getProgram().getId().equals(program.getId())) {
            throw new IllegalStateException("프로그램에 속한 오피스가 아닙니다.");
        }

        return office;
    }*/





}
