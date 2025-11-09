package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.FocusSessionRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FocusSessionService {

    private final FocusSessionRepository repo;

    public FocusSessionService(FocusSessionRepository repo) {
        this.repo = repo;
    }

    public List<FocusSession> getAllSessions(User usuario) {
        return repo.findByUsuario(usuario);
    }

    public List<FocusSession> getSessionsByDate(User usuario, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);
        return repo.findByUsuarioAndInicioBetween(usuario, start, end);
    }

    public FocusSession createSession(User usuario, FocusSession s) {
        s.setUsuario(usuario);
        if (s.getInicio() != null && s.getFim() != null) {
            long min = Duration.between(s.getInicio(), s.getFim()).toMinutes();
            s.setDuracaoMin(min);
        }
        return repo.save(s);
    }

    public FocusSession getSession(Long id, User usuario) {
        return repo.findById(id)
                .filter(s -> s.getUsuario().equals(usuario))
                .orElseThrow(() -> new RuntimeException("Sessão não pertence ao usuário ou não existe"));
    }

    public FocusSession finalizarSession(Long id, User usuario) {
        FocusSession s = getSession(id, usuario);
        s.setFim(LocalDateTime.now());
        long min = Duration.between(s.getInicio(), s.getFim()).toMinutes() - s.getTempoPausa();
        s.setDuracaoMin(min);
        return repo.save(s);
    }

    public FocusSession pausarSession(Long id, User usuario) {
        FocusSession s = getSession(id, usuario);
        if (!s.isPausada()) {
            s.setPausada(true);
            s.setPausaInicio(LocalDateTime.now());
        }
        return repo.save(s);
    }

    public FocusSession continuarSession(Long id, User usuario) {
        FocusSession s = getSession(id, usuario);
        if (s.isPausada() && s.getPausaInicio() != null) {
            long pausaMin = Duration.between(s.getPausaInicio(), LocalDateTime.now()).toMinutes();
            s.setTempoPausa(s.getTempoPausa() + pausaMin);
        }
        s.setPausada(false);
        s.setPausaInicio(null);
        return repo.save(s);
    }
}