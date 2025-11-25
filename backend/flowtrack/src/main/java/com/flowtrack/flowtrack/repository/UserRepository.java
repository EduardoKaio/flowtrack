package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u JOIN FETCH u.pessoa WHERE u.id = :id")
    Optional<User> findByIdWithPessoa(@Param("id") Long id);
    
    @Query("SELECT u FROM User u JOIN u.pessoa p WHERE " +
           "LOWER(p.nome) LIKE :query OR " +
           "LOWER(u.email) LIKE :query")
    Page<User> searchByNomeOrEmail(@Param("query") String query, Pageable pageable);
}