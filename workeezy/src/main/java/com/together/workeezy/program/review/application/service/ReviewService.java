package com.together.workeezy.program.review.application.service;

import com.together.workeezy.program.review.interfaces.dto.ReviewCreateRequest;
import com.together.workeezy.program.review.interfaces.dto.ReviewDto;
import com.together.workeezy.program.program.domain.model.entity.Place;
import com.together.workeezy.program.program.domain.model.entity.PlaceType;
import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.program.review.domain.model.entity.Review;
import com.together.workeezy.program.program.domain.repository.PlaceRepository;
import com.together.workeezy.program.program.domain.repository.ProgramRepository;
import com.together.workeezy.program.review.domain.repository.ReviewRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;

    public List<ReviewDto> getReviewCards() {
        return enrichWithRegionAndImage(
                reviewRepository.findAllReviewCards()
        );
    }

    public List<ReviewDto> getReviewsByProgramId(Long programId) {
        return enrichWithRegionAndImage(
                reviewRepository.findReviewCardsByProgramId(programId)
        );
    }

    /** 리뷰 작성 */
    @Transactional
    public void createReview(ReviewCreateRequest dto) {

        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Program program = programRepository.findById(dto.programId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Review review = Review.create(
                program,
                user,
                dto.reviewText(),
                dto.rating()
        );

        reviewRepository.save(review);
    }

    // ===========================
    // 🔽 내부 구현 (N+1 개선 핵심)
    // ===========================
    private List<ReviewDto> enrichWithRegionAndImage(List<ReviewDto> reviews) {

        if (reviews.isEmpty()) return reviews;

        // 1) 리뷰에 등장하는 programId 수집
        List<Long> programIds = reviews.stream()
                .map(ReviewDto::programId)      // ✅ record accessor
                .distinct()
                .toList();

        // 2) place를 한 번에 조회 (N+1 제거)
        List<Place> places = placeRepository.findByProgramIds(programIds);

        // 3) programId → region / image 맵 구성
        Map<Long, String> regionMap = new HashMap<>();
        Map<Long, String> imageMap = new HashMap<>();

        for (Place place : places) {
            Long pid = place.getProgram().getId();

            regionMap.putIfAbsent(pid, place.getPlaceRegion());

            if (place.getPlaceType() == PlaceType.stay) {
                imageMap.putIfAbsent(pid, place.getPlacePhoto1());
            }
        }

        // 4) 불변 DTO 조립
        return reviews.stream()
                .map(dto -> dto.withRegionAndImage(
                        regionMap.get(dto.programId()),   // ✅ record accessor
                        imageMap.get(dto.programId())
                ))
                .toList();
    }
}
