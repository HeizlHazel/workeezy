package com.together.workeezy.program.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProgramDetailResponseDto {

    private Long id;
    private String title;
    private String programInfo;
    private Integer programPeople;
    private Integer programPrice;

    private String mainImage;
    private List<String> subImages;

    private PlaceDto hotel;               // 숙소 1개
    private List<PlaceDto> offices;       // 오피스 여러 개
    private List<PlaceDto> attractions;   // 액티비티 여러 개

    private List<ReviewDto> reviews;      // 리뷰 목록
}

