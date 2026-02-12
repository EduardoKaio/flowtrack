package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.PasswordChangeDTO;
import com.flowtrack.flowtrack.dto.ProfileDTO;
import com.flowtrack.flowtrack.dto.ProfileUpdateDTO;
import com.flowtrack.flowtrack.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile() {
        try {
            ProfileDTO profile = profileService.getProfile();
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.err.println("Erro ao buscar perfil: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(@RequestBody ProfileUpdateDTO updateDTO) {
        try {
            ProfileDTO updated = profileService.updateProfile(updateDTO);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Erro ao atualizar perfil: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = profileService.uploadAvatar(file);
            return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Erro ao fazer upload de avatar: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao fazer upload da imagem"));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody PasswordChangeDTO passwordDTO) {
        try {
            profileService.changePassword(passwordDTO);
            return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Erro ao alterar senha: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao alterar senha"));
        }
    }
}
