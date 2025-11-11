package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.model.Category;
import com.flowtrack.flowtrack.repository.CategoryRepository;
import com.flowtrack.flowtrack.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final CategoryRepository categoryRepository;

    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.categoryRepository = categoryRepository;
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

        Category categoria = categoryRepository.findById(taskDTO.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID:" + taskDTO.getCategoriaId()));

        task.setCategory(categoria);
        Task savedTask = taskRepository.save(task);
        return taskMapper.taskParaTaskDTO(savedTask);
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        existingTask.setTitulo(taskDTO.getTitulo());
        existingTask.setDescricao(taskDTO.getDescricao());
        existingTask.setDataConclusao(taskDTO.getDataConclusao());
        existingTask.setConcluida(taskDTO.isConcluida());
        existingTask.setPrioridade(taskDTO.getPrioridade());

        if (taskDTO.getCategoriaId() != null) {
            Category categoria = categoryRepository.findById(taskDTO.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID:" + taskDTO.getCategoriaId()));
            existingTask.setCategory(categoria);
        } else {
            existingTask.setCategory(null);
        }

        Task savedTask = taskRepository.save(existingTask);

        return taskMapper.taskParaTaskDTO(savedTask);
    }

    public void deleteTask(Long id) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
        taskRepository.delete(existingTask);
    }


    public Page<TaskDTO> getTasksByTitleOrDescription(String titulo, String descricao, Pageable pageable) {
        return taskRepository.findByTitleOrDescription(titulo, descricao, pageable)
                .map(taskMapper::taskParaTaskDTO);
    }
}
