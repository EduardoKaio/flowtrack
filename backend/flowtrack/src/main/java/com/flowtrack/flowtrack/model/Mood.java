package com.flowtrack.flowtrack.model;

import com.flowtrack.flowtrack.enums.Moods;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "moods")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Mood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Moods humor;

    @Min(1)
    @Max(10)
    private Integer energia;

    @Min(1)
    @Max(10)
    private Integer estresse;

    private String notas;
    private LocalDateTime dataCriacao;

    // solucao temporaria aguardando implementacao de autenticacao
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User usuario;
}
