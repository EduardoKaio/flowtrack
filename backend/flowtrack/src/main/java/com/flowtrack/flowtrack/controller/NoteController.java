package com.flowtrack.flowtrack.controller;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.flowtrack.flowtrack.model.Note;
import com.flowtrack.flowtrack.service.NoteService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notas", description = "Endpoints para gerenciar notas")
public class NoteController {
    
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public ResponseEntity<Note> create(@RequestBody Note note) {
        Note novaNota = noteService.create(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaNota);
    }

    @GetMapping
    public ResponseEntity<Page<Note>> findAll(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        
        Page<Note> notas = noteService.findAllByUser(pageable);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> findById(@PathVariable Long id) {
        Note note = noteService.findByIdAndUser(id);
        return ResponseEntity.ok(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> update(@PathVariable Long id, @RequestBody Note note) {
        Note noteAtualizada = noteService.update(id, note);
        return ResponseEntity.ok(noteAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> toggleArchive(@PathVariable Long id) {
        noteService.toggleArchive(id);
        
        return ResponseEntity.noContent().build();
    }
}
