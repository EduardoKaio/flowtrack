package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HabitsRepository extends JpaRepository<Habits, Long> {
    List<Habits> findByUsuario(User usuario);
    Optional<Habits> findByIdAndUsuario(Long id, User usuario);
    Optional<Habits> findByUsuarioId(Long usuarioId);

}
