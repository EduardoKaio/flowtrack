package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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


}
