package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.DashboardDTO;
import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.mapper.MoodMapper;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.model.FocusSession;
import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.model.Mood;
import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.repository.FocusSessionRepository;
import com.flowtrack.flowtrack.repository.HabitsRepository;
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
    private final FocusSessionRepository focusSessionRepository;
    private final HabitsRepository habitsRepository;
    private final TaskMapper taskMapper;
    private final MoodMapper moodMapper;

    public DashboardService(TaskRepository taskRepository, MoodRepository moodRepository, 
                            FocusSessionRepository focusSessionRepository, TaskMapper taskMapper, 
                            MoodMapper moodMapper, HabitsRepository habitsRepository) { 
        this.taskRepository = taskRepository;
        this.moodRepository = moodRepository;
        this.focusSessionRepository = focusSessionRepository;
        this.taskMapper = taskMapper;
        this.moodMapper = moodMapper;
        this.habitsRepository = habitsRepository;
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
        
        // --- Estatísticas de Foco ---
        List<FocusSession> todaySessions = focusSessionRepository.findByInicioBetween(todayStart, todayEnd);
        long focusTimeToday = todaySessions.stream().mapToLong(FocusSession::getDuracaoMin).sum();
        long focusSessionsToday = todaySessions.size();

        List<Habits> allHabits = habitsRepository.findAll(); 
        
        long habitsTotalToday = allHabits.size(); 
        
        long habitsCompletedToday = allHabits.stream()
                .filter(habit -> habit.getProgresso() != null && 
                                 habit.getProgresso().getDiasConcluidos().contains(today))
                .count();

        return new DashboardDTO(
            completed, total, moodString, moodEmoji, taskDTOs, 
            focusTimeToday, focusSessionsToday,
            habitsCompletedToday, habitsTotalToday
        );
    }
}