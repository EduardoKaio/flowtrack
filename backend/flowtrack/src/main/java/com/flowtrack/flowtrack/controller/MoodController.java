package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.MoodDTO;
import com.flowtrack.flowtrack.service.MoodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/mood")
@Tag(name = "Humor", description = "Endpoints para gerenciar o humor")
public class MoodController {
    private MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    @Operation(summary = "Busca todos os registros de humor", description = "Retorna uma lista paginada com todos os registros de humor")
    @GetMapping
    public ResponseEntity<Page<MoodDTO>> findAllMoods(
            @ParameterObject Pageable pageable) {

        return ResponseEntity.ok(moodService.findAllMoods(pageable));
    }

    @Operation(summary = "Filtra os registros de humor por um intervalo de datas", description = "Retorna uma lista paginada de registros de humor dentro do intervalo de datas especificado")
    @GetMapping("/search")
    public ResponseEntity<Page<MoodDTO>> filterMoodsByDate(
            @Parameter(description = "Data de início do intervalo (formato AAAA-MM-DD)", example = "2023-01-01")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "Data de fim do intervalo (formato AAAA-MM-DD)", example = "2023-01-31")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @ParameterObject Pageable pageable) {

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(moodService.filterMoodsByDate(startDate, endDate, pageable));
        }
        return findAllMoods(pageable);
    }

    @Operation(summary = "Busca um registro de humor pelo ID", description = "Retorna um único registro de humor correspondente ao ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registro de humor encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Registro de humor não encontrado para o ID fornecido")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MoodDTO> findMoodById(@PathVariable Long id) {
        return ResponseEntity.ok(moodService.findMoodById(id));
    }

    @Operation(summary = "Cria um novo registro de humor", description = "Adiciona um novo registro de humor ao banco de dados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Registro de humor criado com sucesso")
    })
    @PostMapping
    public ResponseEntity<MoodDTO> createMood(@Valid @RequestBody MoodDTO moodDTO) {
        return new ResponseEntity<>(moodService.createMood(moodDTO), HttpStatus.CREATED);
    }

    @Operation(summary = "Atualiza um registro de humor existente", description = "Atualiza os dados de um registro de humor existente com base no seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registro de humor atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Registro de humor não encontrado para o ID fornecido")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MoodDTO> updateMood(@PathVariable Long id, @Valid @RequestBody MoodDTO moodDTO) {
        return ResponseEntity.ok(moodService.updateMood(id, moodDTO));
    }

    @Operation(summary = "Exclui um registro de humor", description = "Remove um registro de humor do banco de dados com base no seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Registro de humor excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Registro de humor não encontrado para o ID fornecido")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMood(@PathVariable Long id) {
        moodService.deleteMood(id);
        return ResponseEntity.noContent().build();
    }
}
