package com.flowtrack.flowtrack.dto;

import com.flowtrack.flowtrack.model.User;

import java.time.LocalDate;

public class TaskDTO {
    private String titulo;
    private String descricao;
    private LocalDate dataCriacao;
    private LocalDate dataConclusao;
    private boolean concluida;
    private Integer prioridade; // 1 (alta) 2 (média) 3 (baixa)
    private User usuario;
    //    private Category categoria;

}
