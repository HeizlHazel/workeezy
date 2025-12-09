package com.together.workeezy.program.service;

import com.together.workeezy.program.dto.ReviewDto;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;

    public List<ReviewDto> getReviewCards() {

        List<ReviewDto> reviews = reviewRepository.findAllReviewCards();

        for (ReviewDto dto : reviews) {

            // 숙소(stay)의 대표 이미지 가져오기
            String image = placeRepository.findByProgramId(dto.getProgramId()).stream()
                    .filter(p -> p.getPlaceType() == PlaceType.stay)
                    .map(Place::getPlacePhoto1)
                    .findFirst()
                    .orElse(null);

            dto.setImage(image);
        }

        return reviews;
    }

    public List<ReviewDto> getReviewsByProgramId(Long programId) {

        List<ReviewDto> reviews = reviewRepository.findReviewCardsByProgramId(programId);

        // 이미지 삽입
        for (ReviewDto dto : reviews) {
            String image = placeRepository.findByProgramId(dto.getProgramId()).stream()
                    .filter(p -> p.getPlaceType() == PlaceType.stay)
                    .map(Place::getPlacePhoto1)
                    .findFirst()
                    .orElse(null);
            dto.setImage(image);
        }

        return reviews;
    }

}
