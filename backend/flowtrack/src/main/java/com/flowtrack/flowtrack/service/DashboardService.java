package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.DashboardDTO;
import com.flowtrack.flowtrack.dto.TaskDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.mapper.MoodMapper;
import com.flowtrack.flowtrack.mapper.TaskMapper;
import com.flowtrack.flowtrack.model.FocusSession;
import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.model.Mood;
import com.flowtrack.flowtrack.model.Task;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.FocusSessionRepository;
import com.flowtrack.flowtrack.repository.HabitsRepository;
import com.flowtrack.flowtrack.repository.MoodRepository;
import com.flowtrack.flowtrack.repository.TaskRepository;
import com.flowtrack.flowtrack.util.SecurityUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.flowtrack.flowtrack.util.DateUtil;

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
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        ZoneId brasiliaZone = DateUtil.getBrasiliaZone();
        LocalDate today = DateUtil.hoje();

        // --- Estatísticas de Tarefas ---
        long total = taskRepository.countByDataConclusaoAndUsuario(today, currentUser);
        long completed = taskRepository.countByDataConclusaoAndConcluidaAndUsuario(today, true, currentUser);
        List<Task> tasks = taskRepository.findTop4ByDataConclusaoAndUsuario(today, currentUser);
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(taskMapper::taskParaTaskDTO)
                .collect(Collectors.toList());
    
        // --- Estatísticas de Humor ---
        var todayStart = today.atStartOfDay();
        var todayEnd = today.atTime(LocalTime.MAX);
        Optional<Mood> moodOpt = moodRepository.findTopByUsuarioAndDataCriacaoBetweenOrderByDataCriacaoDesc(currentUser, todayStart, todayEnd);

        String moodString = "Não registrado";
        String moodEmoji = "🤔";

        if (moodOpt.isPresent()) {
            Mood latestMood = moodOpt.get();
            moodString = latestMood.getHumor() != null ? latestMood.getHumor().toString() : "Indefinido"; 
            moodEmoji = latestMood.getEmoji() != null ? latestMood.getEmoji() : "🤔";
        }
        
        // --- Estatísticas de Foco ---
        List<FocusSession> allUserSessions = focusSessionRepository.findByUsuario(currentUser);
        List<FocusSession> todaySessions = allUserSessions.stream()
                .filter(session -> {
                    if (session.getInicio() == null && session.getFim() == null) {
                        return false;
                    }
                    ZonedDateTime inicioZoned = session.getInicio() != null 
                        ? session.getInicio().atZone(java.time.ZoneId.of("UTC")).withZoneSameInstant(brasiliaZone)
                        : null;
                    ZonedDateTime fimZoned = session.getFim() != null 
                        ? session.getFim().atZone(java.time.ZoneId.of("UTC")).withZoneSameInstant(brasiliaZone)
                        : null;
                    
                    // Verificar se início ou fim estão no dia de hoje
                    boolean inicioHoje = inicioZoned != null && 
                        inicioZoned.toLocalDate().equals(today);
                    boolean fimHoje = fimZoned != null && 
                        fimZoned.toLocalDate().equals(today);
                    
                    return inicioHoje || fimHoje;
                })
                .collect(Collectors.toList());
        long focusTimeToday = todaySessions.stream()
                .filter(s -> s.getDuracaoMin() != null)
                .mapToLong(FocusSession::getDuracaoMin)
                .sum();
        long focusSessionsToday = todaySessions.size();

        List<Habits> allHabits = habitsRepository.findByUsuario(currentUser); 
        
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