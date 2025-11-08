package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Mood;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {

    @Query("SELECT m FROM Mood m WHERE m.dataCriacao BETWEEN :startDate AND :endDate")
    Page<Mood> findByDateRange(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate, Pageable pageable);
}
