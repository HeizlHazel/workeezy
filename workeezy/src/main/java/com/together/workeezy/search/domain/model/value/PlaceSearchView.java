package com.together.workeezy.search.domain.model.value;

import lombok.Getter;

@Getter
public class PlaceSearchView {

    private final String region;
    private final String address;
    private final String equipment;

    public PlaceSearchView(String region, String address, String equipment) {
        this.region = region;
        this.address = address;
        this.equipment = equipment;
    }
}
