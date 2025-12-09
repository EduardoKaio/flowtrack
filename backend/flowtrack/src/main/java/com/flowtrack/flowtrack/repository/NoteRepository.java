package com.flowtrack.flowtrack.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flowtrack.flowtrack.model.Note;
import com.flowtrack.flowtrack.model.User;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    Page<Note> findByUsuario(User usuario, Pageable pageable);

    Optional<Note> findByIdAndUsuario(Long id, User usuario);
}
