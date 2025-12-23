package com.together.workeezy.search.domain.model.repository;

import com.together.workeezy.search.domain.model.entity.SearchProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchProgramRepository extends JpaRepository<SearchProgram, Long> {

    // 특정 searchId에 대한 프로그램들 → 유사도 높은 순
    List<SearchProgram> findBySearchIdOrderBySearchPointDesc(Long searchId);
}
