package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.UserDTO;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.UserRepository;

import jakarta.transaction.Transactional;

import java.util.regex.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        // Verifica se email é válido
        if (user.getEmail() == null || !EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new IllegalArgumentException("O email informado é inválido.");
        }

        // Verifica se já existe
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Este email já está cadastrado.");
        }

        return userRepository.save(user);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        // Altera de findAll() para findAll(pageable)
        return userRepository.findAll(pageable);
    }
    public Page<User> searchUsers(String query, Pageable pageable) {
        // Vamos formatar a query para funcionar com o LIKE
        String searchQuery = "%" + query.toLowerCase() + "%";
        
        // Agora chame o método do repositório (que criaremos no passo 2)
        return userRepository.searchByNomeOrEmail(searchQuery, pageable);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional 
    public Optional<User> updateUserFromDTO(Long id, UserDTO dto) {

        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User userToUpdate = userOptional.get();

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            userToUpdate.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            userToUpdate.setEmail(dto.getEmail());
        }

        if (dto.getRole() != null) {
            userToUpdate.setRole(dto.getRole());
        }

        User updatedUser = userRepository.save(userToUpdate);
        return Optional.of(updatedUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public Optional<User> authenticate(String email, String senha) {
        return userRepository.findByEmailAndSenha(email, senha); // substituir por hash depois
    }
}
