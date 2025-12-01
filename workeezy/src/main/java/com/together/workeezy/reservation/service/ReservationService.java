package com.together.workeezy.reservation.service;

import com.together.workeezy.program.Program;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.user.User;
import com.together.workeezy.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    // 예약 저장 메서드
    public Reservation saveReservation(ReservationCreateDto dto) {


        // 1️. 유저 조회 (이메일 기준 예시)
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 사용자를 찾을 수 없습니다."));

        // 2. 프로그램 조회
        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new IllegalArgumentException("해당 프로그램을 찾을 수 없습니다."));
        
        // 3. 오피스 조회
        Place place = placeRepository.findByName(dto.getOfficeName())
                .orElseThrow(() -> new IllegalArgumentException("해당 오피스 장소를 찾을 수 없습니다."));

        // 4 룸(룸타입/호수) 조회
        Room room = roomRepository.findByPlaceAndRoomNo(place, dto.getRoomNo())
                .orElseThrow(() -> new IllegalArgumentException("해당 장소의 룸을 찾을 수 없습니다."));


        Reservation reservation = new Reservation();

        reservation.setUser(user); // get 메소드로 company, phone, email 접근 가능
//        reservation.setCompany(dto.getCompany());
//        reservation.setPhone(dto.getPhone());
//        reservation.setEmail(dto.getEmail());
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setOfficeName(dto.getOfficeName()); //program 엔티티에서 참조
        reservation.setRoomType(dto.getRoomType()); // place 엔티티에서 참조
        reservation.setPeopleCount(dto.getPeopleCount()); // 얘는 컬럼 추가해야함

        return reservationRepository.save(reservation);
    }
}
