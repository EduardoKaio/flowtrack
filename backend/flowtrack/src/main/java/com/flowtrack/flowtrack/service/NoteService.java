package com.flowtrack.flowtrack.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.model.Note;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.NoteRepository;
import com.flowtrack.flowtrack.util.SecurityUtil;

import jakarta.transaction.Transactional;

@Service
public class NoteService {
    
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @Transactional
    public Note create(Note note) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        note.setUsuario(currentUser);

        note.setArchived(false);
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        note.setId(null);
        
        return noteRepository.save(note);
    }

    @Transactional
    public Page<Note> findAllByUser(Pageable pageable) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        return noteRepository.findByUsuario(currentUser, pageable);
    }

    @Transactional
    public Note findByIdAndUser(Long noteId) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        return noteRepository.findByIdAndUsuario(noteId, currentUser)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada ou acesso negado"));
    }

    @Transactional
    public Note update(Long noteId, Note noteAtualizada) {
        Note noteExistente = findByIdAndUser(noteId);

        noteExistente.setTitle(noteAtualizada.getTitle());
        noteExistente.setContent(noteAtualizada.getContent());
        noteExistente.setColor(noteAtualizada.getColor());
        noteExistente.setArchived(noteAtualizada.isArchived());
        noteExistente.setUpdatedAt(LocalDateTime.now());

        return noteRepository.save(noteExistente);
    }

    @Transactional
    public void delete(Long noteId) {
        Note note = findByIdAndUser(noteId);
        noteRepository.delete(note);
    }

    @Transactional
    public void toggleArchive(Long noteId) {
        Note note = findByIdAndUser(noteId);
        
        note.setArchived(!note.isArchived());
        
        noteRepository.save(note);
    }
}
