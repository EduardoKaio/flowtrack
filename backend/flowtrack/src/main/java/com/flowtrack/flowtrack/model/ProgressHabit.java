package com.flowtrack.flowtrack.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDate;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "progress_habit")
public class ProgressHabit {
    
    @Id
    private Long habitId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "habit_id")
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude 
    private Habits habits;

    @ElementCollection
    @CollectionTable(name = "dias_concluidos", joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "dias_concluidos")
    private List<LocalDate> diasConcluidos = new ArrayList<>();

    private int sequenciaAtual = 0;
    private int melhorSequencia = 0;
}
