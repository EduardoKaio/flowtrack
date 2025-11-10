package com.flowtrack.flowtrack.repository;
import com.flowtrack.flowtrack.model.FocusSession;
import com.flowtrack.flowtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {

    List<FocusSession> findByInicioBetween(LocalDateTime start, LocalDateTime end);
    
    List<FocusSession> findByUsuario(User usuario);

    List<FocusSession> findByUsuarioAndInicioBetween(User usuario, LocalDateTime inicio, LocalDateTime fim);
}

