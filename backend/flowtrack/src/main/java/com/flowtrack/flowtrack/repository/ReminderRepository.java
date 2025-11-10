package com.flowtrack.flowtrack.repository;
import com.flowtrack.flowtrack.model.Reminder;
import com.flowtrack.flowtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUsuarioAndAtivo(User usuario, boolean ativo);
    List<Reminder> findByUsuario(User usuario);

    @Query("SELECT r FROM Reminder r WHERE r.usuario = :usuario AND " + "LOWER(r.titulo) LIKE :query")
    List<Reminder> searchByUsuarioAndTitulo(@Param("usuario") User usuario, @Param("query") String query);
}
