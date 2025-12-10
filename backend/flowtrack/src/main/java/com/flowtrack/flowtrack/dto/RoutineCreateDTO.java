package com.flowtrack.flowtrack.dto;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.enums.Period;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineCreateDTO {
    @NotBlank
    private String title;

    private String description;
    private Boolean active = true;
    private Boolean completed = false;
    private LocalDateTime scheduledAt;
    private Integer duration;
    @NotNull(message = "O período é obrigatório")
    private Period periodo;
    private String days;
}
