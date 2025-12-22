package com.together.workeezy.search.domain.model.repository;

import com.together.workeezy.program.program.domain.model.entity.Room;
import com.together.workeezy.program.program.domain.model.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByPlaceId(Long placeId);   // 장소별 객실 조회

    Optional<Object> findFirstByRoomType(RoomType roomType);
}

