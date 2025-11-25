package com.flowtrack.flowtrack.repository;
import com.flowtrack.flowtrack.model.FocusSession;
import com.flowtrack.flowtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {

    List<FocusSession> findByInicioBetween(LocalDateTime start, LocalDateTime end);
    
    List<FocusSession> findByUsuario(User usuario);

    List<FocusSession> findByUsuarioAndInicioBetween(User usuario, LocalDateTime inicio, LocalDateTime fim);
    
    @Query("SELECT s FROM FocusSession s WHERE s.usuario = :usuario AND " +
           "(s.inicio BETWEEN :start AND :end OR s.fim BETWEEN :start AND :end)")
    List<FocusSession> findByUsuarioAndInicioOrFimBetween(@Param("usuario") User usuario, 
                                                           @Param("start") LocalDateTime start, 
                                                           @Param("end") LocalDateTime end);
}

