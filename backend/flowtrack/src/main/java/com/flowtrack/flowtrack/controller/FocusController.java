package com.flowtrack.flowtrack.controller;
import com.flowtrack.flowtrack.dto.FocusSessionCreateDTO;
import com.flowtrack.flowtrack.dto.FocusSettingsDTO;
import com.flowtrack.flowtrack.model.FocusSession;
import com.flowtrack.flowtrack.model.FocusSettings;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.service.FocusSessionService;
import com.flowtrack.flowtrack.service.FocusSettingsService;
import com.flowtrack.flowtrack.util.DateUtil;
import com.flowtrack.flowtrack.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/focus")
@Tag(name = "Focus", description = "Gerenciamento de sessões e configurações de foco")
public class FocusController {

    private final FocusSessionService sessionService;
    private final FocusSettingsService settingsService;

    public FocusController(FocusSessionService sessionService, FocusSettingsService settingsService) {
        this.sessionService = sessionService;
        this.settingsService = settingsService;
    }

    private User getCurrentUser() {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        return currentUser;
    }

    @GetMapping("/sessions")
    @Operation(summary = "Listar sessões", description = "Retorna todas as sessões de foco do usuário, opcionalmente filtradas por data")
    public ResponseEntity<List<FocusSession>> listSessions(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        User user = getCurrentUser();
        if (date != null) {
            return ResponseEntity.ok(sessionService.getSessionsByDate(user, date));
        }
        return ResponseEntity.ok(sessionService.getAllSessions(user));
    }

    @PostMapping("/sessions")
    @Operation(summary = "Criar sessão", description = "Cria uma nova sessão de foco para o usuário")
    public ResponseEntity<FocusSession> createSession(@RequestBody @Valid FocusSessionCreateDTO dto) {
        User user = getCurrentUser();
        FocusSession session = new FocusSession();
        
        // Converter datas recebidas (assumindo que podem vir em UTC) para timezone de Brasília
        ZoneId brasiliaZone = DateUtil.getBrasiliaZone();
        if (dto.getInicio() != null) {
            // Se a data veio como UTC (ISO string com Z), converter para Brasília
            // Se já estiver em Brasília, manter
            ZonedDateTime inicioUTC = dto.getInicio().atZone(ZoneId.of("UTC"));
            session.setInicio(inicioUTC.withZoneSameInstant(brasiliaZone).toLocalDateTime());
        }
        if (dto.getFim() != null) {
            ZonedDateTime fimUTC = dto.getFim().atZone(ZoneId.of("UTC"));
            session.setFim(fimUTC.withZoneSameInstant(brasiliaZone).toLocalDateTime());
        }
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
    public ResponseEntity<FocusSession> getSession(@PathVariable Long id) {
        User user = getCurrentUser();
        FocusSession session = sessionService.getSession(id, user);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/sessions/{id}/pause")
    @Operation(summary = "Pausar sessão", description = "Pausa uma sessão de foco em andamento")
    public ResponseEntity<FocusSession> pause(@PathVariable Long id) {
        User user = getCurrentUser();
        FocusSession session = sessionService.pausarSession(id, user);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/sessions/{id}/resume")
    @Operation(summary = "Retomar sessão", description = "Retoma uma sessão de foco que estava pausada")
    public ResponseEntity<FocusSession> resume(@PathVariable Long id) {
        User user = getCurrentUser();
        FocusSession session = sessionService.continuarSession(id, user);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/sessions/{id}/finish")
    @Operation(summary = "Finalizar sessão", description = "Finaliza uma sessão de foco em andamento")
    public ResponseEntity<FocusSession> finish(@PathVariable Long id) {
        User user = getCurrentUser();
        FocusSession session = sessionService.finalizarSession(id, user);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/settings")
    @Operation(summary = "Obter configurações", description = "Retorna as configurações de foco do usuário")
    public ResponseEntity<FocusSettings> getSettings() {
        User user = getCurrentUser();
        return settingsService.getFocusSettings(user)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    // Retornar configurações padrão se não existir
                    FocusSettings defaultSettings = new FocusSettings();
                    defaultSettings.setFocusTime(25);
                    defaultSettings.setShortBreakTime(5);
                    defaultSettings.setLongBreakTime(15);
                    defaultSettings.setSessionsUntilLongBreak(4);
                    defaultSettings.setUsuario(user);
                    return ResponseEntity.ok(defaultSettings);
                });
    }

    @PutMapping("/settings")
    @Operation(summary = "Atualizar configurações", description = "Atualiza as configurações de foco do usuário")
    public ResponseEntity<FocusSettings> updateSettings(@RequestBody @Valid FocusSettingsDTO dto) {
        User user = getCurrentUser();
        FocusSettings saved = settingsService.saveFocusSettings(user, dto);
        return ResponseEntity.ok(saved);
    }

}