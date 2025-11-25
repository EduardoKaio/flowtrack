package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Mood;
import com.flowtrack.flowtrack.model.User;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MoodRepository extends JpaRepository<Mood, Long> {

    Page<Mood> findByUsuario(User usuario, Pageable pageable);

    @Query("SELECT m FROM Mood m WHERE m.usuario = :usuario AND m.dataCriacao BETWEEN :startDate AND :endDate")
    Page<Mood> findByUsuarioAndDateRange(@Param("usuario") User usuario, @Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate, Pageable pageable);

    Optional<Mood> findByIdAndUsuario(Long id, User usuario);

    Optional<Mood> findTopByUsuarioAndDataCriacaoBetweenOrderByDataCriacaoDesc(User usuario, LocalDateTime start, LocalDateTime end);
    
}
