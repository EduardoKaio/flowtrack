package com.flowtrack.flowtrack.dto;

import com.flowtrack.flowtrack.enums.Prioridade;
import com.flowtrack.flowtrack.model.User;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TaskDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate dataCriacao = LocalDate.now();
    private LocalDate dataConclusao;
    private boolean concluida;
    private Prioridade prioridade; // 1 (alta) 2 (média) 3 (baixa)
    private Long userId;
    private String categoria;

}
