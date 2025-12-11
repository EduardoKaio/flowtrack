package com.flowtrack.flowtrack.dto;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.enums.Period;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineDTO {
    private Long id;
    private String title;
    private String description;
    private Boolean active;
    private Boolean completed;
    private LocalDateTime scheduledAt;
    private String time; // Formato HH:MM
    private Integer duration;
    private String days;
    private Period periodo;
    private Long userId;
}
