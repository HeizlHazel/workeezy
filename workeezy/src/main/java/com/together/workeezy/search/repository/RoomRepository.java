package com.together.workeezy.search.repository;

import com.together.workeezy.program.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByPlaceId(Long placeId);   // 장소별 객실 조회
}

