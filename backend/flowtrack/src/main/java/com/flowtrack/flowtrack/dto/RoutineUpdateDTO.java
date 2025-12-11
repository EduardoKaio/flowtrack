package com.flowtrack.flowtrack.dto;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.enums.Period;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoutineUpdateDTO {
    @NotBlank
    private String title;

    private String description;
    private Boolean active;
    private Boolean completed;
    private LocalDateTime scheduledAt;
    private String time; // Formato HH:MM
    private Integer duration;
    private Period periodo;
    private String days;
}
