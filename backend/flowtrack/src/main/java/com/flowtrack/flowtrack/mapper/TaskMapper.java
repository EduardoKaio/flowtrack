package com.flowtrack.flowtrack.mapper;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.model.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDTO taskParaTaskDTO(Task task);

    Task taskDTOParaTask(TaskDTO taskDTO);
}
