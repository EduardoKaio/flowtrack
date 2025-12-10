package com.flowtrack.flowtrack.mapper;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.dto.RoutineCreateDTO;
import com.flowtrack.flowtrack.dto.RoutineDTO;
import com.flowtrack.flowtrack.dto.RoutineUpdateDTO;
import com.flowtrack.flowtrack.model.Routine;

public final class RoutineMapper {

    private RoutineMapper() {}

    public static RoutineDTO toDto(Routine r) {
        if (r == null) return null;
        return RoutineDTO.builder()
            .id(r.getId())
            .title(r.getTitle())
            .description(r.getDescription())
            .active(r.getActive())
            .completed(r.getCompleted())
            .scheduledAt(r.getScheduledAt())
            .duration(r.getDuration())
            .days(r.getDays())
            .periodo(r.getPeriodo())
            .userId(r.getUser() != null ? r.getUser().getId() : null)
            .build();
    }

    public static Routine toEntity(RoutineCreateDTO dto) {
        if (dto == null) return null;
        return Routine.builder()
            .title(dto.getTitle())
            .description(dto.getDescription())
            .active(dto.getActive() != null ? dto.getActive() : true)
            .completed(dto.getCompleted() != null ? dto.getCompleted() : false)
            .scheduledAt(dto.getScheduledAt())
            .duration(dto.getDuration())
            .days(dto.getDays())
            .periodo(dto.getPeriodo())
            .build();
    }

    public static void updateEntity(RoutineUpdateDTO dto, Routine r) {
        r.setTitle(dto.getTitle());
        r.setDescription(dto.getDescription());
        if (dto.getActive() != null) r.setActive(dto.getActive());
        if (dto.getCompleted() != null) r.setCompleted(dto.getCompleted());
        r.setScheduledAt(dto.getScheduledAt());
        if (dto.getDuration() != null) r.setDuration(dto.getDuration());
        r.setDays(dto.getDays());
        if (dto.getPeriodo() != null) r.setPeriodo(dto.getPeriodo());
    }
}
