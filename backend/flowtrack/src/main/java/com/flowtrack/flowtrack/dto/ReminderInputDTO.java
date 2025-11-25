package com.flowtrack.flowtrack.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderInputDTO {
    @NotBlank
    private String titulo;
    private String descricao;
    @NotNull
    private LocalDateTime dataHora; 
    private boolean ativo;
    
}
