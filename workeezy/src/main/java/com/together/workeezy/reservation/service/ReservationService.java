package com.together.workeezy.reservation.service;

import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;


        public String getRoomType(Long reservationId) {
            Reservation reservation = (Reservation) reservationRepository.findWithRoomType(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 예약이 존재하지 않습니다."));
            return reservation.getProgram()
                    .getPlaces()
                    .getRoom()
                    .getRoomType();
        }
    }


    // 예약 신청 메서드
    public Reservation createNewReservation(ReservationCreateDto dto, Long programId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 유저를 찾을 수 없습니다: " + email));

        Program program = programRepository.findById(programId)
                .orElseThrow(()-> new IllegalArgumentException("해당 프로그램을 찾을 수 없습니다."));


        Reservation reservation = new Reservation();
        reservation.setUser(user); // email
        reservation.setProgram(program); // program_id
        reservation.setStartDate(dto.getStartDate()); // start_date
        reservation.setEndDate(dto.getEndDate()); // end_date
        reservation.setOffice(dto.getOfficeName()); // tb_place place_name
        reservation.setRoomType(dto.getRoomType()); // tb_room room_type
        reservation.setPeopleCount(dto.getPeopleCount()); //people_count
        reservation.setStatus(ReservationStatus.valueOf("waiting"));

        return reservation;

    }
}
