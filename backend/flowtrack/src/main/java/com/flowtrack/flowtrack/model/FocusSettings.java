package com.flowtrack.flowtrack.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "focus_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocusSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer focusTime;
    private Integer shortBreakTime;
    private Integer longBreakTime;
    private Integer sessionsUntilLongBreak;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @JsonIgnore
    private User usuario;

}
