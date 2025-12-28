package com.together.workeezy.program.review.application.service;

import com.together.workeezy.program.program.domain.model.entity.Program;
import com.together.workeezy.program.program.domain.repository.PlaceRepository;
import com.together.workeezy.program.program.domain.repository.ProgramRepository;
import com.together.workeezy.program.review.domain.model.entity.Review;
import com.together.workeezy.program.review.domain.repository.ReviewRepository;
import com.together.workeezy.program.review.interfaces.dto.ReviewCreateRequest;
import com.together.workeezy.program.review.interfaces.dto.ReviewDto;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

    @Transactional
    public void createReview(ReviewCreateRequest dto, String email) {

        if (dto.programId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "programId는 필수입니다.");
        }
        if (dto.rating() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rating은 필수입니다.");
        }
        if (dto.reviewText() == null || dto.reviewText().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reviewText는 필수입니다.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자를 찾을 수 없습니다."));

        Program program = programRepository.findById(dto.programId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found"));

        // ✅ DTO 필드명에 맞게 사용
        Review review = Review.create(
                program,
                user,
                dto.reviewText().trim(), // ✅ 여기!
                dto.rating()
        );

        reviewRepository.save(review);
    }

    // (아래 enrichWithRegionAndImage는 네 업로드본 그대로 두면 됨)
    private List<ReviewDto> enrichWithRegionAndImage(List<ReviewDto> reviews) {
        if (reviews.isEmpty()) return reviews;

        List<Long> programIds = reviews.stream()
                .map(ReviewDto::programId)
                .distinct()
                .toList();

        var places = placeRepository.findByProgramIds(programIds);

        java.util.Map<Long, String> regionMap = new java.util.HashMap<>();
        java.util.Map<Long, String> imageMap = new java.util.HashMap<>();

        for (var place : places) {
            Long pid = place.getProgram().getId();
            regionMap.putIfAbsent(pid, place.getPlaceRegion());
            if (place.getPlaceType() == com.together.workeezy.program.program.domain.model.entity.PlaceType.stay) {
                imageMap.putIfAbsent(pid, place.getPlacePhoto1());
            }
        }

        return reviews.stream()
                .map(dto -> dto.withRegionAndImage(regionMap.get(dto.programId()), imageMap.get(dto.programId())))
                .toList();
    }
}
