package com.flowtrack.flowtrack.repository;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.model.FocusSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FocusSettingsRepository extends JpaRepository<FocusSettings, Long> {
    Optional<FocusSettings> findByUsuario(User usuario);
}


