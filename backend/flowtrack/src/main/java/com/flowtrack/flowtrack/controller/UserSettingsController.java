package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.UserSettingsDTO;
import com.flowtrack.flowtrack.dto.UserSettingsUpdateDTO;
import com.flowtrack.flowtrack.security.SecurityUtils;
import com.flowtrack.flowtrack.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping
    public ResponseEntity<UserSettingsDTO> getSettings() {
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            UserSettingsDTO settings = userSettingsService.getSettingsByUserId(userId);
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            System.err.println("Erro ao buscar configuracoes: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping
    public ResponseEntity<UserSettingsDTO> updateSettings(@RequestBody UserSettingsUpdateDTO updateDTO) {
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            UserSettingsDTO updated = userSettingsService.updateSettings(userId, updateDTO);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Erro ao atualizar configuracoes: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
