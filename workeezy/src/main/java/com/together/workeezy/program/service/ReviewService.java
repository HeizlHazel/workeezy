package com.together.workeezy.program.service;

import com.together.workeezy.program.dto.ReviewCreateRequest;
import com.together.workeezy.program.dto.ReviewDto;
import com.together.workeezy.program.entity.Place;
import com.together.workeezy.program.entity.PlaceType;
import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.entity.Review;
import com.together.workeezy.program.repository.PlaceRepository;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.program.repository.ReviewRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;
    private final ProgramRepository programRepository;


    /** 전체 리뷰 카드 조회 */
    public List<ReviewDto> getReviewCards() {

        List<ReviewDto> reviews = reviewRepository.findAllReviewCards();

        for (ReviewDto dto : reviews) {

            // 지역 채우기
            String region = placeRepository.findByProgramId(dto.getProgramId()).stream()
                    .findFirst()
                    .map(Place::getPlaceRegion)
                    .orElse(null);
            dto.setRegion(region);

            // 이미지 채우기
            String image = placeRepository.findByProgramId(dto.getProgramId()).stream()
                    .filter(p -> p.getPlaceType() == PlaceType.stay)
                    .map(Place::getPlacePhoto1)
                    .findFirst()
                    .orElse(null);
            dto.setImage(image);
        }

        return reviews;
    }


    /** 특정 프로그램 리뷰 */
    public List<ReviewDto> getReviewsByProgramId(Long programId) {

        List<ReviewDto> reviews = reviewRepository.findReviewCardsByProgramId(programId);

        for (ReviewDto dto : reviews) {

            // 지역 채우기
            String region = placeRepository.findByProgramId(dto.getProgramId()).stream()
                    .findFirst()
                    .map(Place::getPlaceRegion)
                    .orElse(null);
            dto.setRegion(region);

            // 이미지 채우기
            String image = placeRepository.findByProgramId(dto.getProgramId()).stream()
                    .filter(p -> p.getPlaceType() == PlaceType.stay)
                    .map(Place::getPlacePhoto1)
                    .findFirst()
                    .orElse(null);
            dto.setImage(image);
        }

        return reviews;
    }


    /** 리뷰 작성 */
    @Transactional
    public void createReview(ReviewCreateRequest dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Review review = new Review();
        review.setUser(user);
        review.setProgram(program);
        review.setReviewPoint(dto.getRating());
        review.setContent(dto.getReviewText());
        review.setReviewDate(LocalDateTime.now());

        reviewRepository.save(review);
    }

}
