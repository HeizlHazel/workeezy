package com.together.workeezy.search.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProgramIndexRow {
    private Long programId;
    private String title;
    private String programInfo;
    private Integer price;
    private String placeRegion;
    private String placePhoto1;
}
