package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE LOWER(t.titulo) LIKE LOWER(:titulo)")
    Page<Task> findByTitle(@Param("titulo") String titulo, Pageable pageable);
}
