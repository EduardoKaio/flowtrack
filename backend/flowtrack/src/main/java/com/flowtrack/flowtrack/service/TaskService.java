package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.model.Category;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.CategoryRepository;
import com.flowtrack.flowtrack.repository.TaskRepository;
import com.flowtrack.flowtrack.util.DateUtil;
import com.flowtrack.flowtrack.util.SecurityUtil;
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
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        return taskRepository.findByUsuario(currentUser, pageable)
                .map(taskMapper::taskParaTaskDTO);
    }

    public TaskDTO getTaskById(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        return taskRepository.findByIdAndUsuario(id, currentUser)
                .map(taskMapper::taskParaTaskDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        System.out.println("[TASK SERVICE] Recebido TaskDTO:");
        System.out.println("  - dataConclusao recebida: " + taskDTO.getDataConclusao());
        System.out.println("  - dataCriacao recebida: " + taskDTO.getDataCriacao());
        System.out.println("  - Data de hoje (Brasília): " + DateUtil.hoje());
        
        Task task = taskMapper.taskDTOParaTask(taskDTO);

        task.setDataCriacao(DateUtil.hoje());
        System.out.println("  - dataCriacao definida na task: " + task.getDataCriacao());
        
        if (taskDTO.getDataConclusao() != null) {
            task.setDataConclusao(taskDTO.getDataConclusao());
            System.out.println("  - dataConclusao definida na task: " + task.getDataConclusao());
        } else {
            System.out.println("  - dataConclusao é null, não foi definida");
        }

        Category categoria = categoryRepository.findByIdAndVisibleForUser(taskDTO.getCategoriaId(), currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID:" + taskDTO.getCategoriaId()));

        task.setCategory(categoria);
        task.setUsuario(currentUser);
        
        System.out.println("[TASK SERVICE] Salvando task com:");
        System.out.println("  - dataCriacao: " + task.getDataCriacao());
        System.out.println("  - dataConclusao: " + task.getDataConclusao());
        
        Task savedTask = taskRepository.save(task);
        
        System.out.println("[TASK SERVICE] Task salva:");
        System.out.println("  - ID: " + savedTask.getId());
        System.out.println("  - dataCriacao salva: " + savedTask.getDataCriacao());
        System.out.println("  - dataConclusao salva: " + savedTask.getDataConclusao());
        
        TaskDTO result = taskMapper.taskParaTaskDTO(savedTask);
        System.out.println("[TASK SERVICE] TaskDTO retornado:");
        System.out.println("  - dataCriacao: " + result.getDataCriacao());
        System.out.println("  - dataConclusao: " + result.getDataConclusao());
        
        return result;
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        Task existingTask = taskRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));

        existingTask.setTitulo(taskDTO.getTitulo());
        existingTask.setDescricao(taskDTO.getDescricao());
        existingTask.setDataConclusao(taskDTO.getDataConclusao());
        existingTask.setConcluida(taskDTO.isConcluida());
        existingTask.setPrioridade(taskDTO.getPrioridade());

        if (taskDTO.getCategoriaId() != null) {
            Category categoria = categoryRepository.findByIdAndVisibleForUser(taskDTO.getCategoriaId(), currentUser)
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com ID:" + taskDTO.getCategoriaId()));
            existingTask.setCategory(categoria);
        } else {
            existingTask.setCategory(null);
        }

        Task savedTask = taskRepository.save(existingTask);

        return taskMapper.taskParaTaskDTO(savedTask);
    }

    public void deleteTask(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        Task existingTask = taskRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada com ID: " + id));
        taskRepository.delete(existingTask);
    }


    public Page<TaskDTO> getTasksByTitleOrDescription(String titulo, String descricao, Pageable pageable) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        return taskRepository.findByTitleOrDescriptionAndUsuario(titulo, descricao, currentUser, pageable)
                .map(taskMapper::taskParaTaskDTO);
    }
}
