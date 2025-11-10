package com.flowtrack.flowtrack.service;
import com.flowtrack.flowtrack.dto.FocusSettingsDTO;
import com.flowtrack.flowtrack.model.FocusSettings;
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

    public FocusSettings saveFocusSettings(User usuario, FocusSettingsDTO dto) {
        
        Optional<FocusSettings> existingSettingsOpt = repository.findByUsuario(usuario);

        FocusSettings settingsToSave;

        if (existingSettingsOpt.isPresent()) {

            settingsToSave = existingSettingsOpt.get();
        } else {
            settingsToSave = new FocusSettings();
            settingsToSave.setUsuario(usuario);
        }

        settingsToSave.setFocusTime(dto.getFocusTime());
        settingsToSave.setShortBreakTime(dto.getShortBreakTime());
        settingsToSave.setLongBreakTime(dto.getLongBreakTime());
        settingsToSave.setSessionsUntilLongBreak(dto.getSessionsUntilLongBreak());

        return repository.save(settingsToSave);
    }
}
