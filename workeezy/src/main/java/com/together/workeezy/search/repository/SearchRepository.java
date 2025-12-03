package com.together.workeezy.search.repository;

import com.together.workeezy.search.entity.Search;
import com.together.workeezy.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchRepository extends JpaRepository<Search, Long> {

    // 최근 검색어(사용자별)
    List<Search> findTop10ByUserOrderBySearchTimeDesc(User user);

    // 인기 검색어
    @Query("""
        SELECT s.searchPhrase, COUNT(s) 
        FROM Search s 
        GROUP BY s.searchPhrase
        ORDER BY COUNT(s) DESC
    """)
    List<Object[]> findPopularKeywords();
}
