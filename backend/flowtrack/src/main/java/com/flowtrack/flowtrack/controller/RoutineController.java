package com.flowtrack.flowtrack.controller;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.dto.RoutineCreateDTO;
import com.flowtrack.flowtrack.dto.RoutineDTO;
import com.flowtrack.flowtrack.dto.RoutineUpdateDTO;
import com.flowtrack.flowtrack.service.RoutineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routines")
@Tag(name = "Rotinas", description = "Operações CRUD para rotinas do usuário autenticado")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;

    @Operation(summary = "Criar rotina")
    @PostMapping
    public ResponseEntity<RoutineDTO> create(@Valid @RequestBody RoutineCreateDTO dto) {
        RoutineDTO created = routineService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Atualizar rotina")
    @PutMapping("/{id}")
    public ResponseEntity<RoutineDTO> update(@PathVariable Long id, @Valid @RequestBody RoutineUpdateDTO dto) {
        RoutineDTO updated = routineService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Excluir rotina")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routineService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Buscar rotina por id")
    @GetMapping("/{id}")
    public ResponseEntity<RoutineDTO> getById(@PathVariable Long id) {
        RoutineDTO dto = routineService.findById(id);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Listar rotinas do usuário (paginado)")
    @GetMapping
    public ResponseEntity<Page<RoutineDTO>> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id,desc") String sort) {

        Sort sortObj = Sort.by(Sort.Order.desc("id"));
        try {
            String[] parts = sort.split(",");
            sortObj = "desc".equalsIgnoreCase(parts[1]) ? Sort.by(Sort.Order.desc(parts[0])) : Sort.by(Sort.Order.asc(parts[0]));
        } catch (Exception ignored) {}

        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<RoutineDTO> result = routineService.findAll(pageable);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Listar todas as rotinas do usuário (sem paginação)")
    @GetMapping("/all")
    public ResponseEntity<List<RoutineDTO>> listAll() {
        return ResponseEntity.ok(routineService.findAllNoPage());
    }
    
    @Operation(summary = "Alternar status de conclusão da rotina")
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<RoutineDTO> toggleCompleted(@PathVariable Long id) {
        RoutineDTO dto = routineService.toggleCompleted(id);
        return ResponseEntity.ok(dto);
    }
}

