package com.together.workeezy.search.repository;

import com.together.workeezy.program.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProgramId(Long programId);
}
