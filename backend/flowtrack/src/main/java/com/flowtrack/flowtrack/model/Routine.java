package com.flowtrack.flowtrack.model;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.enums.Period;
import com.flowtrack.flowtrack.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "routines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(length = 5)
    private String time; // Formato HH:MM

    @Column(nullable = false)
    private Integer duration;

    @Column(length = 500)
    private String days;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Period periodo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
