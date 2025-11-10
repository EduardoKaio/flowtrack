package com.flowtrack.flowtrack.dto;

import com.flowtrack.flowtrack.model.TipoFrequencia;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitsDTO {
    
    private String nome;
    private String descricao;
    private Integer meta;
    private TipoFrequencia tipoFrequencia;
    private String cor;
    private String icone;

}
