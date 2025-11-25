package com.flowtrack.flowtrack.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.flowtrack.flowtrack.config.LocalDateDeserializer;
import com.flowtrack.flowtrack.enums.Prioridade;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TaskDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate dataCriacao;
    
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dataConclusao;
    
    private boolean concluida;
    private Prioridade prioridade; // 1 (alta) 2 (média) 3 (baixa)
    private Long userId;
    private Long categoriaId;
    private String categoria;

}
