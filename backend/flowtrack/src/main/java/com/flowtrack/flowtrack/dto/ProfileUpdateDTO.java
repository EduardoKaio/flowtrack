package com.flowtrack.flowtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateDTO {
    private String nome;
    private String bio;
    private String location;
    private String telefone;
    private String endereco;
}
