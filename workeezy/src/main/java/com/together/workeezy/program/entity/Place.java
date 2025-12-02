package com.together.workeezy.program.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tb_place")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Enumerated(EnumType.STRING)
    @Column(name = "place_type")
    private PlaceType placeType;

    @Size(max = 100)
    @NotNull
    @Column(name = "place_name", nullable = false, length = 100)
    private String name;

    @Size(max = 100)
    @Column(name = "place_code", length = 100)
    private String placeCode;

    @Size(max = 1000)
    @Column(name = "place_address", length = 1000)
    private String placeAddress;

    @Size(max = 15)
    @Column(name = "place_phone", length = 15)
    private String placePhone;

    @Size(max = 100)
    @Column(name = "place_equipment", length = 100)
    private String placeEquipment;

    @Size(max = 100)
    @Column(name = "place_photo1", length = 100)
    private String placePhoto1;

    @Size(max = 100)
    @Column(name = "place_photo2", length = 100)
    private String placePhoto2;

    @Size(max = 100)
    @Column(name = "place_photo3", length = 100)
    private String placePhoto3;

    @Size(max = 100)
    @Column(name = "attraction_url", length = 100)
    private String attractionUrl;

}