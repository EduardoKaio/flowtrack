package com.flowtrack.flowtrack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(name = "theme", length = 20)
    private String theme = "light"; // "light", "dark", "system"

    @Column(name = "notifications")
    private Boolean notifications = true;

    @Column(name = "sound_enabled")
    private Boolean soundEnabled = true;

    @Column(name = "language", length = 10)
    private String language = "pt-BR";

    @Column(name = "enabled_modules", columnDefinition = "TEXT")
    private String enabledModules; // JSON string com os módulos habilitados

    // Módulos padrão habilitados: tarefas, categorias, foco, habitos, bem-estar
    public static String getDefaultEnabledModules() {
        return "{\"tarefas\":true,\"categorias\":true,\"foco\":true,\"habitos\":true,\"bem-estar\":true,\"notas\":false,\"rotina\":false,\"lembretes\":false,\"relatorios\":false}";
    }
}
