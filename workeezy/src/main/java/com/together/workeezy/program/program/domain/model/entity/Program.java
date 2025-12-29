package com.together.workeezy.program.program.domain.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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



    // ===========================
    // 🔒 내부 검증
    // ===========================
    private void validate(String title, Integer people, Integer price) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("프로그램 제목은 필수입니다.");
        }
        if (people != null && people <= 0) {
            throw new IllegalArgumentException("인원은 1명 이상이어야 합니다.");
        }
        if (price != null && price < 0) {
            throw new IllegalArgumentException("가격은 0 이상이어야 합니다.");
        }
    }
}
