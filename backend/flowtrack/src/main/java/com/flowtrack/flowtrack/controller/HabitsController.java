package com.flowtrack.flowtrack.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowtrack.flowtrack.dto.HabitsDTO;
import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.service.HabitsService;
import com.flowtrack.flowtrack.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("api/habits")
@Tag(name = "Habits", description = "Gerenciamento de hábitos")
public class HabitsController {
    
    private final HabitsService habitsService;
    private final UserService userService; // temporário, para associar hábitos a usuários

    public HabitsController(HabitsService habitsService, UserService userService) {
        this.habitsService = habitsService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Listar todos os hábitos", description = "Retorna uma lista de todos os hábitos cadastrados")
    public ResponseEntity<?> getAllHabits() {
        return ResponseEntity.ok(habitsService.getAllHabits());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obter hábito por ID", description = "Retorna os detalhes de um hábito pelo seu ID")
    public ResponseEntity<?> getHabitById(@PathVariable Long id) {
        try {
            Habits habit = habitsService.getHabitById(id);
            return ResponseEntity.ok(habit);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("{\"message\": \"Hábito não encontrado.\"}");
        }
    }

    @PostMapping
    @Operation(summary = "Criar hábito", description = "Cria um novo hábito para o usuário")
    public ResponseEntity<?> createHabit(@RequestBody HabitsDTO habitDTO) {
        try {
            System.out.println("Entrou no controller");
            Habits created = habitsService.createHabit(habitDTO);
            System.out.println(created);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocorreu um erro ao criar o hábito. Tente novamente.");
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar hábito", description = "Edita um hábito existente pelo ID")
    public ResponseEntity<?> editHabit(@PathVariable Long id, @RequestBody Habits updatedHabit) {
        try {
            Habits habit = habitsService.updateHabit(id, updatedHabit);
            return ResponseEntity.ok(habit);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("{\"message\": \"Hábito não encontrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocorreu um erro ao atualizar o hábito. Tente novamente.");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar hábito", description = "Deleta um hábito existente pelo ID")
    public ResponseEntity<?> deleteHabit(@PathVariable Long id) {
        try {
            habitsService.deleteHabit(id);
            return ResponseEntity.ok("{\"message\": \"Hábito deletado com sucesso.\"}");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("{\"message\": \"Hábito não encontrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocorreu um erro ao deletar o hábito. Tente novamente.");
        }
    }

    @PostMapping("/{habitId}/completar-dia")
    @Operation(summary = "Adicionar dia concluído", description = "Adiciona um dia concluído ao progresso do hábito")
    public ResponseEntity<?> addCompleteDay(@PathVariable Long habitId) {
        try {
            return ResponseEntity.ok(habitsService.addCompleteDay(habitId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("{\"message\": \"Hábito não encontrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocorreu um erro ao registrar o dia concluído. Tente novamente.");
        }
    }

    @GetMapping("{habitId}/progresso")
    @Operation(summary = "Obter progresso do hábito", description = "Retorna o progresso do hábito pelo ID")
    public ResponseEntity<?> getHabitProgress(@PathVariable Long habitId) {
        try {
            double progresso = habitsService.calcularProgresso(habitId);
            return ResponseEntity.ok(Map.of("progresso", progresso));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("{\"message\": \"Hábito não encontrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocorreu um erro ao obter o progresso do hábito. Tente novamente.");
        }
    }
}
