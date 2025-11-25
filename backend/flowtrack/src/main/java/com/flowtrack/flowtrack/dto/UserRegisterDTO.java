package com.flowtrack.flowtrack.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class UserRegisterDTO {
    // Dados da Pessoa
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private String telefone;
    private String endereco;
    
    // Dados do User
    private String email;
    private String senha;
    
}