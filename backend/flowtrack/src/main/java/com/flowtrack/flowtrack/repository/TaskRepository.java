package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.model.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByUsuario(User usuario, Pageable pageable);
    
    Optional<Task> findByIdAndUsuario(Long id, User usuario);

    @Query(value = "SELECT t FROM Task t LEFT JOIN FETCH t.category c " +
                   "WHERE t.usuario = :usuario " +
                   "AND ((LOWER(t.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')) OR :titulo = '') " +
                   "OR (LOWER(t.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) OR :descricao = ''))",
           countQuery = "SELECT count(t) FROM Task t " +
                        "WHERE t.usuario = :usuario " +
                        "AND ((LOWER(t.titulo) LIKE LOWER(CONCAT('%', :titulo, '%')) OR :titulo = '') " +
                        "OR (LOWER(t.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) OR :descricao = ''))")
    Page<Task> findByTitleOrDescriptionAndUsuario(@Param("titulo") String titulo, @Param("descricao") String descricao, @Param("usuario") User usuario, Pageable pageable);

    List<Task> findTop4ByDataConclusaoAndUsuario(LocalDate date, User usuario);

    long countByDataConclusaoAndUsuario(LocalDate date, User usuario);

    long countByDataConclusaoAndConcluidaAndUsuario(LocalDate date, boolean concluida, User usuario);
}
