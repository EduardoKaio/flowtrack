package com.flowtrack.flowtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Long id;
    private String nome;
    private String email;
    private String bio;
    private String location;
    private String avatarUrl;
    private LocalDate joinDate; // Data de criação do usuário
    private String telefone;
    private String endereco;
}
