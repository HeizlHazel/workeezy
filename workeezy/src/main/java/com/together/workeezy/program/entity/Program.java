package com.together.workeezy.program.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tb_program")
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id", nullable = false)
    private Long id;

    @OneToMany(mappedBy = "program", fetch = FetchType.LAZY)
    private List<Place> places;


    @Size(max = 100)
    @NotNull
    @Column(name = "program_title", nullable = false, length = 100)
    private String title;

    @NotNull
    @Lob
    @Column(name = "program_info", nullable = false)
    private String programInfo;

    @Column(name = "program_people")
    private Integer programPeople;

    @Column(name = "program_price")
    private Integer programPrice;

    @Column(name = "stay_id")
    private Long stayId;

    @Column(name = "office_id")
    private Long officeId;

    @Column(name = "attraction_id1")
    private Long attractionId1;

    @Column(name = "attraction_id2")
    private Long attractionId2;

    @Column(name = "attraction_id3")
    private Long attractionId3;

}