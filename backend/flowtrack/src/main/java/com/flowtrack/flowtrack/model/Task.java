package com.flowtrack.flowtrack.model;

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
    private LocalDate dataCriacao = LocalDate.now();
    private LocalDate dataConclusao;
    private boolean concluida;
    private Integer prioridade; // 1 (alta) 2 (média) 3 (baixa)

//    @ManyToOne
//    private Category categoria;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User usuario;
}
