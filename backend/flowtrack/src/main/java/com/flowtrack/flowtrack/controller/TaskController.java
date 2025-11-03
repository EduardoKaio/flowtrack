package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/tasks")
@Tag(name = "Tasks", description = "Operações relacionadas a tarefas")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Listar tarefas", description = "Retorna uma página de tarefas. Se o parâmetro 'titulo' for informado, filtra pelo título.")
    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getAllTasks(
           @ParameterObject @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        return ResponseEntity.ok(taskService.getAllTasks(pageable));
    }

    @Operation(summary = "Pesquisar tarefas", description = "Retorna uma página de tarefas filtradas por título ou descrição.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Página de tarefas retornada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Nenhuma Tarefa encontrada")
    })
    @GetMapping("/search")
    public ResponseEntity<Page<TaskDTO>> searchTasks(
            @RequestParam(required = false, defaultValue = "") String titulo,
            @RequestParam(required = false, defaultValue = "") String descricao,
            @ParameterObject @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(taskService.getTasksByTitleOrDescription(titulo, descricao, pageable));
    }

    @Operation(summary = "Obter tarefa por ID", description = "Retorna uma tarefa pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tarefa encontrada"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @Operation(summary = "Criar nova tarefa", description = "Cria uma nova tarefa com os dados fornecidos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tarefa criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PostMapping("/add")
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        return new ResponseEntity<TaskDTO>(taskService.createTask(taskDTO), HttpStatus.CREATED);
    }

    @Operation(summary = "Atualizar tarefa", description = "Atualiza os dados de uma tarefa existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO));
    }

    @Operation(summary = "Excluir tarefa", description = "Remove uma tarefa pelo ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Tarefa excluída com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Alternar conclusão da tarefa", description = "Marca/desmarca a tarefa como concluída.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskDTO> toggleTaskCompletion(@PathVariable Long id) {
        TaskDTO taskDTO = taskService.getTaskById(id);
        taskDTO.setConcluida(!taskDTO.isConcluida());
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }
}
