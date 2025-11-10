package com.flowtrack.flowtrack.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.flowtrack.flowtrack.dto.HabitsDTO;
import com.flowtrack.flowtrack.model.Habits;
import com.flowtrack.flowtrack.model.ProgressHabit;
import com.flowtrack.flowtrack.model.TipoFrequencia;
import com.flowtrack.flowtrack.repository.HabitsRepository;

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
        System.out.println("Entrou no service");
        ProgressHabit progresso = new ProgressHabit();

        Habits habit = new Habits();
        habit.setNome(habitDTO.getNome());
        habit.setDescricao(habitDTO.getDescricao());
        habit.setMeta(habitDTO.getMeta());
        habit.setTipoFrequencia(habitDTO.getTipoFrequencia());
        habit.setCor(habitDTO.getCor());
        habit.setIcone(habitDTO.getIcone());
        habit.setUsuario(null);
        habit.setProgresso(progresso);
        progresso.setHabits(habit);
        
        Habits savedHabit = habitsRepository.save(habit);

        System.out.println("Salvou");

        return savedHabit;
    }
    
    public Habits getHabitById(Long id) {
        return habitsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + id));
    }

    public Optional<Habits> getHabitByUser(Long usuarioId) {
        return habitsRepository.findByUsuarioId(usuarioId);
    }

    public List<Habits> getAllHabits() {
        return habitsRepository.findAll();
    }

    @Transactional 
    public Habits updateHabit(Long id, Habits updatedHabit) {
        Habits habit = habitsRepository.findById(id)
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
        if (!habitsRepository.existsById(id)) {
            throw new EntityNotFoundException("Hábito não encontrado com id: " + id);
        }

        habitsRepository.deleteById(id);
    }

    @Transactional 
    public ProgressHabit addCompleteDay(Long habitId) {
        LocalDate hoje = LocalDate.now();
        Habits habit = habitsRepository.findById(habitId)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado com id: " + habitId));
        
        ProgressHabit progresso = habit.getProgresso();

        if (progresso == null) {
            progresso = new ProgressHabit();
            habit.setProgresso(progresso);
        }
        
        if (!progresso.getDiasConcluidos().contains(hoje)) {
            progresso.getDiasConcluidos().add(hoje);

            calcularSequencia(progresso, habit.getTipoFrequencia());
        }

        habitsRepository.save(habit);
        return progresso;
    }

    public double calcularProgresso(Long habitId) {
        Habits habit = habitsRepository.findById(habitId)
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
        LocalDate hoje = LocalDate.now();

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
