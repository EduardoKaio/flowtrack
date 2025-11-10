package com.flowtrack.flowtrack.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocusSessionCreateDTO {
    @NotNull(message = "O campo 'inicio' é obrigatório")
    private LocalDateTime inicio;

    private LocalDateTime fim;

    @Min(value = 0, message = "Duração deve ser positiva")
    private Long duracaoMin;
}

