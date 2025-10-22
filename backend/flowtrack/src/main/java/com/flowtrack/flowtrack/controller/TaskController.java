package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

//    @GetMapping
//    public ResponseEntity<Page<TaskDTO>> getAllTasks(Pageable pageable) {
//        return ResponseEntity.ok(taskService.getAllTasks(pageable));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
//        // Lógica para obter uma tarefa pelo ID
//    }
//
//    @PostMapping
//    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
//        // Lógica para criar uma nova tarefa
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
//        // Lógica para atualizar uma tarefa existente
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
//        // Lógica para deletar uma tarefa
//    }
//
//    @PatchMapping("/{id}/toggle")
//    public ResponseEntity<TaskDTO> toggleTaskCompletion(@PathVariable Long id) {
//        // Lógica para alternar o status de conclusão da tarefa
//    }
}
