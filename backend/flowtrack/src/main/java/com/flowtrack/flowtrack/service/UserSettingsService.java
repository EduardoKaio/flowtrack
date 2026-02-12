package com.flowtrack.flowtrack.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowtrack.flowtrack.dto.UserSettingsDTO;
import com.flowtrack.flowtrack.dto.UserSettingsUpdateDTO;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.model.UserSettings;
import com.flowtrack.flowtrack.repository.UserRepository;
import com.flowtrack.flowtrack.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public UserSettingsDTO getSettingsByUserId(Long userId) {
        // Primeiro tenta buscar sem criar (read-only)
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElse(null);

        // Se nao existir, cria em uma transacao separada
        if (settings == null) {
            settings = createDefaultSettings(userId);
        }

        return convertToDTO(settings);
    }

    @Transactional
    public UserSettingsDTO updateSettings(Long userId, UserSettingsUpdateDTO updateDTO) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));

        // Atualiza apenas os campos fornecidos
        if (updateDTO.getTheme() != null) {
            settings.setTheme(updateDTO.getTheme());
        }
        if (updateDTO.getNotifications() != null) {
            settings.setNotifications(updateDTO.getNotifications());
        }
        if (updateDTO.getSoundEnabled() != null) {
            settings.setSoundEnabled(updateDTO.getSoundEnabled());
        }
        if (updateDTO.getLanguage() != null) {
            settings.setLanguage(updateDTO.getLanguage());
        }
        if (updateDTO.getEnabledModules() != null) {
            try {
                String modulesJson = objectMapper.writeValueAsString(updateDTO.getEnabledModules());
                settings.setEnabledModules(modulesJson);
            } catch (Exception e) {
                throw new RuntimeException("Erro ao serializar modulos habilitados", e);
            }
        }

        UserSettings saved = userSettingsRepository.save(settings);
        return convertToDTO(saved);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private UserSettings createDefaultSettings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado: " + userId));

        UserSettings settings = new UserSettings();
        settings.setUser(user);
        settings.setTheme("light");
        settings.setNotifications(true);
        settings.setSoundEnabled(true);
        settings.setLanguage("pt-BR");
        settings.setEnabledModules(UserSettings.getDefaultEnabledModules());

        return userSettingsRepository.save(settings);
    }

    private UserSettingsDTO convertToDTO(UserSettings settings) {
        UserSettingsDTO dto = new UserSettingsDTO();
        dto.setTheme(settings.getTheme() != null ? settings.getTheme() : "light");
        dto.setNotifications(settings.getNotifications() != null ? settings.getNotifications() : true);
        dto.setSoundEnabled(settings.getSoundEnabled() != null ? settings.getSoundEnabled() : true);
        dto.setLanguage(settings.getLanguage() != null ? settings.getLanguage() : "pt-BR");

        // Deserializar enabledModules com tratamento de erro robusto
        if (settings.getEnabledModules() != null && !settings.getEnabledModules().trim().isEmpty()) {
            try {
                Map<String, Boolean> modules = objectMapper.readValue(
                        settings.getEnabledModules(),
                        new TypeReference<Map<String, Boolean>>() {}
                );
                dto.setEnabledModules(modules);
            } catch (Exception e) {
                System.err.println("Erro ao deserializar enabledModules: " + e.getMessage());
                // Se houver erro, usa os modulos padrao
                dto.setEnabledModules(getDefaultModulesMap());
            }
        } else {
            // Se enabledModules for null ou vazio, usa os padroes
            dto.setEnabledModules(getDefaultModulesMap());
        }

        return dto;
    }

    private Map<String, Boolean> getDefaultModulesMap() {
        try {
            return objectMapper.readValue(
                    UserSettings.getDefaultEnabledModules(),
                    new TypeReference<Map<String, Boolean>>() {}
            );
        } catch (Exception e) {
            System.err.println("Erro ao deserializar modulos padrao: " + e.getMessage());
            // Fallback hardcoded se o JSON padrao falhar
            Map<String, Boolean> defaultModules = new HashMap<>();
            defaultModules.put("tarefas", true);
            defaultModules.put("categorias", true);
            defaultModules.put("foco", true);
            defaultModules.put("habitos", true);
            defaultModules.put("bem-estar", true);
            defaultModules.put("notas", false);
            defaultModules.put("rotina", false);
            defaultModules.put("lembretes", false);
            defaultModules.put("relatorios", false);
            return defaultModules;
        }
    }
}
