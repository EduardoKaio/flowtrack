package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.FocusSessionCreateDTO;
import com.flowtrack.flowtrack.dto.FocusSettingsDTO;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.service.FocusSessionService;
import com.flowtrack.flowtrack.service.FocusSettingsService;
import com.flowtrack.flowtrack.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/focus")
@Tag(name = "Focus", description = "Gerenciamento de sessões e configurações de foco")
public class FocusController {

    private final FocusSessionService sessionService;
    private final FocusSettingsService settingsService;
    private final UserService userService;

    public FocusController(FocusSessionService sessionService, FocusSettingsService settingsService, UserService userService) {

        this.sessionService = sessionService;
        this.settingsService = settingsService;
        this.userService = userService;

    }

    private User getUser(String userID) {

        return userService.getUserById(Long.parseLong(userID)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

    }

    @GetMapping("/sessions")
    @Operation(summary = "Listar sessões", description = "Retorna todas as sessões de foco do usuário, opcionalmente filtradas por data")
    public ResponseEntity<List<FocusSession>> listSessions( @RequestHeader("userID") String userID, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        User user = getUser(userID);
        if (date != null) {
            return ResponseEntity.ok(sessionService.getSessionsByDate(user, date));
        }
        return ResponseEntity.ok(sessionService.getAllSessions(user));

    }

    @PostMapping("/sessions")
    @Operation(summary = "Criar sessão", description = "Cria uma nova sessão de foco para o usuário")
    public ResponseEntity<FocusSession> createSession(@RequestHeader("userID") String userID, @RequestBody @Valid FocusSessionCreateDTO dto) {

        User user = getUser(userID);
        FocusSession session = new FocusSession();
        session.setInicio(dto.getInicio());
        session.setFim(dto.getFim());
        session.setDuracaoMin(dto.getDuracaoMin());
        session.setUsuario(user);

        try {
            FocusSession created = sessionService.createSession(user, session);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro ao criar sessão: " + e.getMessage());
        }

    }

    @GetMapping("/sessions/{id}")
    @Operation(summary = "Obter sessão", description = "Retorna os detalhes de uma sessão específica do usuário")
    public ResponseEntity<FocusSession> getSession(@RequestHeader("userID") String userID, @PathVariable Long id) {

        User user = getUser(userID);
        FocusSession session = sessionService.getSession(id, user);
        return ResponseEntity.ok(session);

    }

    @PutMapping("/sessions/{id}/pause")
    @Operation(summary = "Pausar sessão", description = "Pausa uma sessão de foco em andamento")
    public ResponseEntity<FocusSession> pause(@RequestHeader("userID") String userID, @PathVariable Long id) {

        User user = getUser(userID);
        FocusSession session = sessionService.pausarSession(id, user);
        return ResponseEntity.ok(session);

    }

    @PutMapping("/sessions/{id}/resume")
    @Operation(summary = "Retomar sessão", description = "Retoma uma sessão de foco que estava pausada")
    public ResponseEntity<FocusSession> resume(@RequestHeader("userID") String userID, @PathVariable Long id) {

        User user = getUser(userID);
        FocusSession session = sessionService.continuarSession(id, user);
        return ResponseEntity.ok(session);

    }

    @PutMapping("/sessions/{id}/finish")
    @Operation(summary = "Finalizar sessão", description = "Finaliza uma sessão de foco em andamento")
    public ResponseEntity<FocusSession> finish(@RequestHeader("userID") String userID, @PathVariable Long id) {

        User user = getUser(userID);
        FocusSession session = sessionService.finalizarSession(id, user);
        return ResponseEntity.ok(session);

    }

    @GetMapping("/settings")
    @Operation(summary = "Obter configurações", description = "Retorna as configurações de foco do usuário")
    public ResponseEntity<FocusSettings> getSettings(@RequestHeader("userID") String userID) {

        User user = getUser(userID);
        return ResponseEntity.of(settingsService.getFocusSettings(user));

    }

    @PutMapping("/settings")
    @Operation(summary = "Atualizar configurações", description = "Atualiza as configurações de foco do usuário")
    public ResponseEntity<FocusSettings> updateSettings(@RequestHeader("userID") String userID, @RequestBody @Valid FocusSettingsDTO dto) {

        User user = getUser(userID);
        FocusSettings settings = new FocusSettings();
        settings.setFocusTime(dto.getFocusTime());
        settings.setShortBreakTime(dto.getShortBreakTime());
        settings.setLongBreakTime(dto.getLongBreakTime());
        settings.setSessionsUntilLongBreak(dto.getSessionsUntilLongBreak());
        settings.setUsuario(user);

        FocusSettings saved = settingsService.saveFocusSettings(settings);
        return ResponseEntity.ok(saved);

    }

}