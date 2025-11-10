package com.flowtrack.flowtrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.model.TipoFrequencia;

import java.util.Optional;

public interface HabitsRepository extends JpaRepository<Habits, Long> {
    Optional<Habits> findByUsuarioId(Long usuarioId);
    Optional<Habits> findByTipoFrequencia(TipoFrequencia tipoFrequencia);
}
