package com.flowtrack.flowtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    // Estatísticas das Tarefas
    private long tasksCompletedToday;
    private long tasksTotalToday;

    // Estatísticas de Humor
    private String currentMood;
    private String currentMoodEmoji;

    // Lista de Tarefas
    private List<TaskDTO> todayTasks;

    // Estatísticas de Foco
    private long focusTimeToday;
    private long focusSessionsToday; 

    // Estatísticas de Hábitos
    private long habitsCompletedToday;
    private long habitsTotalToday;
}