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
    Optional<User> findByEmailAndSenha(String email, String senha);
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.nome) LIKE :query OR " +
           "LOWER(u.email) LIKE :query")
    Page<User> searchByNomeOrEmail(@Param("query") String query, Pageable pageable);
}