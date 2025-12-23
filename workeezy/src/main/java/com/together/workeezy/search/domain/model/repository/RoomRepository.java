package com.together.workeezy.search.domain.model.repository;

import com.together.workeezy.program.program.domain.model.entity.Room;
import com.together.workeezy.program.program.domain.model.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // 기존: 장소별 객실 조회
    List<Room> findByPlaceId(Long placeId);

    // ✅ ProgramService에서 이미 사용 중 (N+1 방지용)
    List<Room> findByPlaceIdIn(List<Long> placeIds);

}
