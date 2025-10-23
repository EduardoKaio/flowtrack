package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    public Page<TaskDTO> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(taskMapper::taskParaTaskDTO);
    }

    public TaskDTO getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(taskMapper::taskParaTaskDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = taskMapper.taskDTOParaTask(taskDTO);
        Task savedTask = taskRepository.save(task);
        return taskMapper.taskParaTaskDTO(savedTask);
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        Task updatedTask = taskMapper.taskDTOParaTask(taskDTO);

        updatedTask.setId(existingTask.getId());

        Task savedTask = taskRepository.save(updatedTask);

        return taskMapper.taskParaTaskDTO(savedTask);
    }

    public void deleteTask(Long id) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
        taskRepository.delete(existingTask);
    }


    public Page<TaskDTO> getTasksByTitle(String titulo, Pageable pageable) {
        String tituloLike = "%" + titulo.toLowerCase() + "%";
        return taskRepository.findByTitle(tituloLike, pageable)
                .map(taskMapper::taskParaTaskDTO);
    }
}
