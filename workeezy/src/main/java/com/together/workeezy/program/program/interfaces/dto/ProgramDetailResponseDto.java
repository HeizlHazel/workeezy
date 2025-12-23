package com.together.workeezy.program.program.interfaces.dto;

import com.together.workeezy.program.review.interfaces.dto.ReviewDto;
import java.util.List;

public record ProgramDetailResponseDto(
        Long id,
        String title,
        String programInfo,
        Integer programPeople,
        Integer programPrice,
        String mainImage,
        List<String> subImages,
        PlaceDto hotel,               // 숙소 1개
        List<PlaceDto> offices,       // 오피스 여러 개
        List<PlaceDto> attractions,   // 액티비티 여러 개
        List<ReviewDto> reviews       // 리뷰 목록


) {

}
