package com.flowtrack.flowtrack.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
    private String nome;
    private String email;
    private String senha;
}