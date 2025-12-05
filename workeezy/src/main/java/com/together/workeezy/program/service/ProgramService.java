package com.together.workeezy.program.service;

import com.together.workeezy.program.dto.*;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.search.repository.ReviewRepository;
import com.together.workeezy.search.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.toList;

@RequiredArgsConstructor
@Service
@Transactional
public class ProgramService {

    private final ProgramRepository programRepository;
    private final PlaceRepository placeRepository;
    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;

    /**
     * 🔍 검색 기능 — 기존 코드 그대로 유지
     */
    public List<ProgramCardDto> search(String keyword, String region) {
        List<Program> programs = programRepository.searchByKeyword(keyword);

        return programs.stream()
                .map(p -> {

                    // ⭐ stay 타입의 장소 region 하나 가져오기
                    String placeRegion = p.getPlaces().stream()
                            .filter(pl -> pl.getPlaceType() == PlaceType.stay)
                            .map(Place::getPlaceRegion)
                            .findFirst()
                            .orElse(null);

                    String photo = placeRepository.findPhotosByProgramId(p.getId())
                            .stream()
                            .findFirst()
                            .orElse(null);

                    return new ProgramCardDto(
                            p.getId(),
                            p.getTitle(),
                            photo,
                            p.getProgramPrice(),
                            placeRegion   // ⭐ region 추가
                    );
                })
                .toList();
    }


    /**
     * ⭐ 상세조회 기능 추가 — 상세페이지에서 사용
     */
    public ProgramDetailResponseDto getProgramDetail(Long programId) {

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        // 장소 조회
        List<Place> places = placeRepository.findByProgramId(programId);

// stay / office 찾기
        Place stay = places.stream()
                .filter(p -> p.getPlaceType() == PlaceType.stay)
                .findFirst()
                .orElse(null);

        Place office = places.stream()
                .filter(p -> p.getPlaceType() == PlaceType.office)
                .findFirst()
                .orElse(null);

// ⭐ 메인 이미지
        String mainImage = (stay != null) ? stay.getPlacePhoto1() : null;

// ⭐ 서브 이미지
        List<String> subImages = new ArrayList<>();

        if (stay != null) {
            if (stay.getPlacePhoto2() != null) subImages.add(stay.getPlacePhoto2());
            if (stay.getPlacePhoto3() != null) subImages.add(stay.getPlacePhoto3());
        }

        if (office != null) {
            if (office.getPlacePhoto1() != null) subImages.add(office.getPlacePhoto1());
            if (office.getPlacePhoto2() != null) subImages.add(office.getPlacePhoto2());
        }

        if (subImages.size() > 4) {
            subImages = subImages.subList(0, 4);
        }



        // 장소별 분류
        PlaceDto hotel = null;
        List<PlaceDto> offices = new ArrayList<>();
        List<PlaceDto> attractions = new ArrayList<>();

        for (Place p : places) {
            List<RoomDto> roomDtos = roomRepository.findByPlaceId(p.getId())
                    .stream()
                    .map(r -> new RoomDto(
                            r.getId(),
                            r.getRoomNo(),
                            r.getRoomPeople(),
                            r.getRoomService()
                    )).toList();

            PlaceDto dto = new PlaceDto(
                    p.getId(),
                    p.getName(),
                    p.getPlaceAddress(),
                    p.getPlacePhone(),
                    p.getPlacePhoto1(),
                    p.getPlacePhoto2(),
                    p.getPlacePhoto3(),
                    p.getPlaceEquipment(),
                    p.getPlaceType(),
                    roomDtos         // 추가
            );

            if (p.getPlaceType() == PlaceType.stay) hotel = dto;
            if (p.getPlaceType() == PlaceType.office) offices.add(dto);
            if (p.getPlaceType() == PlaceType.attraction) attractions.add(dto);
        }

        // 리뷰 조회
        List<ReviewDto> reviews = reviewRepository.findByProgramId(programId)
                .stream()
                .map(r -> new ReviewDto(
                        r.getId(),
                        r.getTitle(),
                        r.getContent(),
                        r.getReviewPoint(),
                        r.getReviewDate(),
                        r.getUser().getUserName()  // 유저 이름도 추가 가능
                )).toList();

        return new ProgramDetailResponseDto(
                program.getId(),
                program.getTitle(),
                program.getProgramInfo(),
                program.getProgramPeople(),
                program.getProgramPrice(),
                mainImage,
                subImages,
                hotel,
                offices,
                attractions,
                reviews
        );
    }
}

