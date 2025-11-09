package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.FocusSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FocusSettingsService {

    private final FocusSettingsRepository repository;

    public FocusSettingsService(FocusSettingsRepository repository) {
        this.repository = repository;
    }

    public Optional<FocusSettings> getFocusSettings(User usuario) {
        return repository.findByUsuario(usuario);
    }

    public FocusSettings saveFocusSettings(FocusSettings settings) {
        return repository.save(settings);
    }
}
