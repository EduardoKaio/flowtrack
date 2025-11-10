package com.flowtrack.flowtrack.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocusSettingsDTO {
    @NotNull(message = "O campo 'focusTime' é obrigatório")
    @Min(value = 1, message = "Tempo de foco deve ser pelo menos 1 minuto")
    private Integer focusTime;

    @NotNull(message = "O campo 'shortBreakTime' é obrigatório")
    @Min(value = 1, message = "Tempo de pausa curta deve ser pelo menos 1 minuto")
    private Integer shortBreakTime;

    @NotNull(message = "O campo 'longBreakTime' é obrigatório")
    @Min(value = 1, message = "Tempo de pausa longa deve ser pelo menos 1 minuto")
    private Integer longBreakTime;

    @NotNull(message = "O campo 'sessionsUntilLongBreak' é obrigatório")
    @Min(value = 1, message = "Sessões até pausa longa deve ser pelo menos 1")
    private Integer sessionsUntilLongBreak;
}
