package com.flowtrack.flowtrack.repository;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.model.Routine;
import com.flowtrack.flowtrack.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoutineRepository extends JpaRepository<Routine, Long> {

    Page<Routine> findByUser(User user, Pageable pageable);

    List<Routine> findByUser(User user);

    Optional<Routine> findByIdAndUser(Long id, User user);
}
