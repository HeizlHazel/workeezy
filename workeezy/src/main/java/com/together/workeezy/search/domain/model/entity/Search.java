package com.together.workeezy.search.domain.model.entity;

import com.together.workeezy.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "tb_search")
public class Search {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "search_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "search_time", updatable = false)
    private LocalDateTime searchTime;

    @Size(max = 100)
    @Column(name = "search_phrase", length = 100)
    private String searchPhrase;

    // ===========================
    // ✅ 생성 팩토리 메서드
    // ===========================
    public static Search create(User user, String searchPhrase) {
        Search search = new Search();
        search.user = user;
        search.searchPhrase = searchPhrase;
        return search;
    }
}
