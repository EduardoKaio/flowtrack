package com.flowtrack.flowtrack.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReminderDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDateTime dataHora;
    private boolean ativo;
}