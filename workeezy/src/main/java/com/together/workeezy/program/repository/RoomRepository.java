package com.together.workeezy.program.repository;

import com.together.workeezy.program.entity.Room;
import com.together.workeezy.program.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room,Long> {
    Optional<Object> findByRoomType(RoomType roomType);
}
