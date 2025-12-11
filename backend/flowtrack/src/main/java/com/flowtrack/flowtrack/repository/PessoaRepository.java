package com.flowtrack.flowtrack.repository;

import com.flowtrack.flowtrack.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    Optional<Pessoa> findByCpf(String cpf);
    
    // Query para buscar apenas o nome da Pessoa pelo ID
    @Query("SELECT p.nome FROM Pessoa p WHERE p.id = :id")
    Optional<String> findNomeById(@Param("id") Long id);
}
