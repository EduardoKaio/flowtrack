package com.flowtrack.flowtrack.mapper;

import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "category.id", target = "categoriaId")
    @Mapping(source = "category.name", target = "categoria")
    TaskDTO taskParaTaskDTO(Task task);

    Task taskDTOParaTask(TaskDTO taskDTO);
}
