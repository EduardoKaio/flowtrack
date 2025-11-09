package com.flowtrack.flowtrack.controller;
import com.flowtrack.flowtrack.dto.ReminderDTO;
import com.flowtrack.flowtrack.dto.ReminderInputDTO;
import com.flowtrack.flowtrack.model.Reminder;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.UserRepository;
import com.flowtrack.flowtrack.service.ReminderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reminders")
@Tag(name = "Reminders", description = "Gerenciamento de lembretes")
public class ReminderController {

    private final ReminderService reminderService;
    private final UserRepository userRepository;

    public ReminderController(ReminderService reminderService, UserRepository userRepository) {

        this.reminderService = reminderService;
        this.userRepository = userRepository;

    }

    @GetMapping
    @Operation(summary = "Listar lembretes", description = "Retorna uma lista de todos os lembretes do usuário, opcionalmente filtrando por query")
    public ResponseEntity<List<ReminderDTO>> listReminders(@RequestHeader("userID") String userID, @RequestParam(name = "query", required = false) String query) {

        Optional<User> usuarioOpt = userRepository.findById(Long.parseLong(userID));
        if (usuarioOpt.isEmpty()) return ResponseEntity.status(404).build();
        User usuario = usuarioOpt.get();

        List<Reminder> reminderList =
                (query != null && !query.isBlank())
                        ? reminderService.searchRemindersByUser(query, usuario)
                        : reminderService.getAllRemindersByUser(usuario);

        List<ReminderDTO> dto = reminderList.stream()
                .map(r -> new ReminderDTO(
                        r.getId(),
                        r.getTitulo(),
                        r.getDescricao(),
                        r.getDataHora(),
                        r.isAtivo()
                ))
                .toList();

        return ResponseEntity.ok(dto);

    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter lembrete", description = "Retorna os detalhes de um lembrete específico do usuário")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getReminder(@PathVariable Long id, @RequestHeader("userID") String userID) {

        Optional<Reminder> reminderOpt = reminderService.getReminderById(id);
        if (reminderOpt.isEmpty())
            return ResponseEntity.status(404).body("{\"message\": \"Lembrete não encontrado.\"}");

        Reminder reminder = reminderOpt.get();

        if (!reminder.getUsuario().getId().equals(Long.parseLong(userID)))
            return ResponseEntity.status(403).body("{\"message\": \"Acesso negado.\"}");

        ReminderDTO dto = new ReminderDTO(
                reminder.getId(),
                reminder.getTitulo(),
                reminder.getDescricao(),
                reminder.getDataHora(),
                reminder.isAtivo()
        );

        return ResponseEntity.ok(dto);

    }

    @PostMapping
    @Operation(summary = "Criar lembrete", description = "Cria um novo lembrete para o usuário")
    public ResponseEntity<?> createReminder(@Valid @RequestBody ReminderInputDTO dto, @RequestHeader("userID") String userID) {

        try {
            Reminder reminder = reminderService.createReminder(dto, Long.parseLong(userID));

            ReminderDTO out = new ReminderDTO(
                    reminder.getId(),
                    reminder.getTitulo(),
                    reminder.getDescricao(),
                    reminder.getDataHora(),
                    reminder.isAtivo()
            );

            return ResponseEntity.status(201).body(out);

        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body("{\"message\": \"Erro ao criar lembrete: " + e.getMessage() + "\"}");
        }

    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar lembrete", description = "Atualiza um lembrete existente do usuário")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @Valid @RequestBody ReminderInputDTO dto, @RequestHeader("userID") String userID) {

        Optional<Reminder> updated =
                reminderService.updateReminder(id, dto, Long.parseLong(userID));

        if (updated.isEmpty())
            return ResponseEntity.status(404)
                    .body("{\"message\": \"Lembrete não encontrado ou acesso negado.\"}");

        Reminder r = updated.get();

        ReminderDTO out = new ReminderDTO(
                r.getId(),
                r.getTitulo(),
                r.getDescricao(),
                r.getDataHora(),
                r.isAtivo()
        );

        return ResponseEntity.ok(out);

    }


    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir lembrete", description = "Exclui um lembrete existente do usuário")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id, @RequestHeader("userID") String userID) {

        boolean deleted = reminderService.deleteReminder(id, Long.parseLong(userID));

        if (!deleted)
            return ResponseEntity.status(404)
                    .body("{\"message\": \"Lembrete não encontrado ou acesso negado.\"}");

        return ResponseEntity.ok("{\"message\": \"Lembrete excluído com sucesso.\"}");

    }

}
