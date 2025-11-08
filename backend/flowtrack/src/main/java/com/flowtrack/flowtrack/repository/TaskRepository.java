package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Task;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE (LOWER(t.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')) OR LOWER(t.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))")
    Page<Task> findByTitleOrDescription(@Param("titulo") String titulo, @Param("descricao") String descricao, Pageable pageable);

    List<Task> findTop4ByDataConclusao(LocalDate date);

    long countByDataConclusao(LocalDate date);

    long countByDataConclusaoAndConcluida(LocalDate date, boolean concluida);
}
