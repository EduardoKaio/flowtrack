package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.DashboardDTO;
import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.mapper.MoodMapper;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.model.Mood;
import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.repository.MoodRepository;
import com.flowtrack.flowtrack.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;
    private final MoodRepository moodRepository;
    private final TaskMapper taskMapper;
    private final MoodMapper moodMapper;

    public DashboardService(TaskRepository taskRepository, MoodRepository moodRepository, TaskMapper taskMapper, MoodMapper moodMapper) {
        this.taskRepository = taskRepository;
        this.moodRepository = moodRepository;
        this.taskMapper = taskMapper;
        this.moodMapper = moodMapper;
    }

    public DashboardDTO getDashboardStats() {
        LocalDate today = LocalDate.now();

        // --- Estatísticas de Tarefas ---
        long total = taskRepository.countByDataConclusao(today);
        long completed = taskRepository.countByDataConclusaoAndConcluida(today, true);
        List<Task> tasks = taskRepository.findTop4ByDataConclusao(today);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(taskMapper::taskParaTaskDTO)
                .collect(Collectors.toList());
    
        // --- Estatísticas de Humor ---
        var todayStart = today.atStartOfDay();
        var todayEnd = today.atTime(LocalTime.MAX);
        Optional<Mood> moodOpt = moodRepository.findTopByDataCriacaoBetweenOrderByDataCriacaoDesc(todayStart, todayEnd);

        String moodString = "Não registrado";
        String moodEmoji = "🤔";

        if (moodOpt.isPresent()) {
            Mood latestMood = moodOpt.get();
            moodString = latestMood.getHumor() != null ? latestMood.getHumor().toString() : "Indefinido"; 
            moodEmoji = latestMood.getEmoji() != null ? latestMood.getEmoji() : "🤔";
        }

        return new DashboardDTO(completed, total, moodString, moodEmoji, taskDTOs);
    }
}