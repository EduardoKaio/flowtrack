package com.flowtrack.flowtrack.service;
import com.flowtrack.flowtrack.dto.ReminderInputDTO;
import com.flowtrack.flowtrack.model.Reminder;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.ReminderRepository;
import com.flowtrack.flowtrack.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public ReminderService(ReminderRepository reminderRepository, UserRepository userRepository) {

        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;

    }

    public List<Reminder> getAllRemindersByUser(User usuario) {  
        return reminderRepository.findByUsuario(usuario);
    }

    public List<Reminder> searchRemindersByUser(String query, User usuario) {  
        String searchQuery = "%" + query.toLowerCase() + "%";
        return reminderRepository.searchByUsuarioAndTitulo(usuario, searchQuery);
    }

    public Optional<Reminder> getReminderById(Long id) {
        return reminderRepository.findById(id);
    }

    @Transactional
    public Reminder createReminder(ReminderInputDTO dto, Long userID) {

        User usuario = userRepository.findById(userID).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        Reminder reminder = new Reminder();
        reminder.setTitulo(dto.getTitulo());
        reminder.setDescricao(dto.getDescricao());
        reminder.setDataHora(dto.getDataHora());
        reminder.setAtivo(dto.isAtivo());
        reminder.setUsuario(usuario);

        return reminderRepository.save(reminder);
    }


    @Transactional
    public Optional<Reminder> updateReminder(Long id, ReminderInputDTO dto, Long userID) {
        Optional<Reminder> reminderOpt = reminderRepository.findById(id);
        if (reminderOpt.isEmpty()) return Optional.empty();

        Reminder reminder = reminderOpt.get();

        if (!reminder.getUsuario().getId().equals(userID))
            return Optional.empty();

        reminder.setTitulo(dto.getTitulo());
        reminder.setDescricao(dto.getDescricao());
        reminder.setDataHora(dto.getDataHora());
        reminder.setAtivo(dto.isAtivo());

        return Optional.of(reminderRepository.save(reminder));
    }

    @Transactional
    public boolean deleteReminder(Long id, Long userID) {

        Optional<Reminder> reminderOpt = reminderRepository.findById(id);
        if (reminderOpt.isEmpty()) return false;

        Reminder reminder = reminderOpt.get();

        if (!reminder.getUsuario().getId().equals(userID))
            return false;

        reminderRepository.delete(reminder);
        return true;
    }

    @Transactional
    @Scheduled(fixedRate = 60000)
    public void markExpiredReminders() {
        List<Reminder> active = reminderRepository.findAll().stream()
                .filter(r -> r.isAtivo() && r.getDataHora().isBefore(LocalDateTime.now()))
                .toList();

        active.forEach(r -> {
            r.setAtivo(false);
            reminderRepository.save(r);
        });
    }
}