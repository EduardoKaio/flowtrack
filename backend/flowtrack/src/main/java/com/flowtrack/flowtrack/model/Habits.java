package com.flowtrack.flowtrack.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.flowtrack.flowtrack.util.DateUtil;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "habits")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Habits {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String descricao;
    
    @Min(1)
    private Integer meta; // quantas vezes deve ser feito no período (ex: 8 por dia, 3 por semana)
    
    @Enumerated(EnumType.STRING)
    private TipoFrequencia tipoFrequencia; // DIARIO, SEMANAL

    private LocalDate dataCriacao = DateUtil.hoje();
    private String cor;
    private String icone;

    @ManyToOne(optional = true)
    @JoinColumn(name = "usuario_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User usuario;

    @OneToOne(mappedBy = "habits", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude 
    private ProgressHabit progresso;
}
