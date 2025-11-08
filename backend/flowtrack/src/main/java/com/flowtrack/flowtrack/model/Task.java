package com.flowtrack.flowtrack.model;

import com.flowtrack.flowtrack.enums.Prioridade;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private LocalDate dataCriacao;
    private LocalDate dataConclusao;
    private boolean concluida;
    private Prioridade prioridade;

//    @ManyToOne
    private String categoria;

    // solucao temporaria aguardando implementacao de autenticacao
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User usuario;
}
