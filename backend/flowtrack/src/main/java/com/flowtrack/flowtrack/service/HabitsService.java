package com.flowtrack.flowtrack.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.flowtrack.flowtrack.dto.HabitsDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.model.ProgressHabit;
import com.flowtrack.flowtrack.model.TipoFrequencia;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.HabitsRepository;
import com.flowtrack.flowtrack.util.DateUtil;
import com.flowtrack.flowtrack.util.SecurityUtil;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class HabitsService {
    private final HabitsRepository habitsRepository;
    
    public HabitsService(HabitsRepository habitsRepository) {
        this.habitsRepository = habitsRepository;
    }


    @Transactional
    public Habits createHabit(HabitsDTO habitDTO) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        ProgressHabit progresso = new ProgressHabit();

        Habits habit = new Habits();
        habit.setNome(habitDTO.getNome());
        habit.setDescricao(habitDTO.getDescricao());
        habit.setMeta(habitDTO.getMeta());
        habit.setTipoFrequencia(habitDTO.getTipoFrequencia());
        habit.setCor(habitDTO.getCor());
        habit.setIcone(habitDTO.getIcone());
        habit.setUsuario(currentUser);
        habit.setProgresso(progresso);
        progresso.setHabits(habit);
        
        Habits savedHabit = habitsRepository.save(habit);

        return savedHabit;
    }
    
    public Habits getHabitById(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        return habitsRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + id));
    }

    public List<Habits> getAllHabits() {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        return habitsRepository.findByUsuario(currentUser);
    }

    @Transactional 
    public Habits updateHabit(Long id, Habits updatedHabit) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        Habits habit = habitsRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + id));

        habit.setNome(updatedHabit.getNome());
        habit.setDescricao(updatedHabit.getDescricao());
        habit.setTipoFrequencia(updatedHabit.getTipoFrequencia());
        habit.setMeta(updatedHabit.getMeta());
        habit.setCor(updatedHabit.getCor());
        habit.setIcone(updatedHabit.getIcone());

        return habitsRepository.save(habit);
    }

    @Transactional
    public void deleteHabit(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }

        Habits habit = habitsRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + id));

        habitsRepository.delete(habit);
    }

    @Transactional 
    public ProgressHabit addCompleteDay(Long habitId) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        LocalDate hoje = DateUtil.hoje();
        System.out.println("[HABITS SERVICE] Adicionando dia concluído:");
        System.out.println("  - Habit ID: " + habitId);
        System.out.println("  - Data de hoje (Brasília): " + hoje);
        System.out.println("  - Data atual do sistema: " + java.time.LocalDate.now());
        
        Habits habit = habitsRepository.findByIdAndUsuario(habitId, currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + habitId));
        
        ProgressHabit progresso = habit.getProgresso();

        if (progresso == null) {
            progresso = new ProgressHabit();
            habit.setProgresso(progresso);
            System.out.println("  - Progresso criado (não existia)");
        }
        
        System.out.println("  - Dias concluídos antes: " + progresso.getDiasConcluidos());
        System.out.println("  - Já contém hoje? " + progresso.getDiasConcluidos().contains(hoje));
        
        if (!progresso.getDiasConcluidos().contains(hoje)) {
            progresso.getDiasConcluidos().add(hoje);
            System.out.println("  - Dia adicionado: " + hoje);
            System.out.println("  - Dias concluídos depois: " + progresso.getDiasConcluidos());

            calcularSequencia(progresso, habit.getTipoFrequencia());
        } else {
            System.out.println("  - Dia já estava concluído, não adicionado novamente");
        }

        Habits savedHabit = habitsRepository.save(habit);
        System.out.println("  - Hábito salvo. Dias concluídos finais: " + savedHabit.getProgresso().getDiasConcluidos());
        
        return progresso;
    }

    public double calcularProgresso(Long habitId) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        Habits habit = habitsRepository.findByIdAndUsuario(habitId, currentUser)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + habitId));

        ProgressHabit progresso = habit.getProgresso();

        if (habit.getMeta() <= 0) {
            throw new IllegalArgumentException("A meta do hábito deve ser maior que zero.");
        }

        int diasCompletos = progresso.getDiasConcluidos().size();
        double progressoPercentual = ((double) diasCompletos / habit.getMeta()) * 100.0;

        return Math.min(progressoPercentual, 100.0);
    }

    private void calcularSequencia(ProgressHabit progresso, TipoFrequencia tipoFrequencia) {
        if (tipoFrequencia != TipoFrequencia.DIARIO) {
            progresso.setSequenciaAtual(0);
            progresso.setMelhorSequencia(0);
            return;
        }

        List<LocalDate> diasCompletos = progresso.getDiasConcluidos().stream()
                .sorted()
                .collect(Collectors.toList());

        if (diasCompletos.isEmpty()) {
            progresso.setSequenciaAtual(0);
            progresso.setMelhorSequencia(0);
            return;
        }

        int sequenciaAtual = 0;
        int melhorSequencia = progresso.getMelhorSequencia();

        progresso.setMelhorSequencia(calculaMelhorSequencia(diasCompletos, sequenciaAtual, melhorSequencia));
        progresso.setSequenciaAtual(calculaSequeciaAtual(diasCompletos, sequenciaAtual));
    }

    private int calculaMelhorSequencia(List<LocalDate> diasCompletos, int sequenciaAtual, int melhorSequencia) {
        for (int i = 0; i < diasCompletos.size(); i++) {
            if (i == 0 || diasCompletos.get(i).minusDays(1).equals(diasCompletos.get(i-1))) {
                sequenciaAtual++;
            } else if (!diasCompletos.get(i).equals(diasCompletos.get(i-1))) {
                sequenciaAtual = 1;
            }

            if (sequenciaAtual > melhorSequencia) {
                melhorSequencia = sequenciaAtual;
            }
        }
        
        return melhorSequencia;
    }

    private int calculaSequeciaAtual(List<LocalDate> diasCompletos, int sequenciaAtual) {
        LocalDate hoje = DateUtil.hoje();

        if (diasCompletos.contains(hoje) || diasCompletos.contains(hoje.minusDays(1))) {
            LocalDate diaParaChecar = diasCompletos.contains(hoje) ? hoje : hoje.minusDays(1);

            while (diasCompletos.contains(diaParaChecar)) {
                sequenciaAtual++;
                diaParaChecar = diaParaChecar.minusDays(1);
            }
        }

        return sequenciaAtual;
    }
}
