package com.together.workeezy.program.program.interfaces.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.together.workeezy.program.program.domain.model.entity.PlaceType;

import java.util.List;

@Data
@AllArgsConstructor
public class PlaceDto {

    private Long id;
    private String name;
    private String address;
    private String phone;

    private String photo1;
    private String photo2;
    private String photo3;

    private String equipment;
    private PlaceType type;

    private String region;
    private List<RoomDto> rooms;  // 숙소인 경우에만 사용
}
