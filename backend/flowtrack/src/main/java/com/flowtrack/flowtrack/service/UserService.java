package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.UserDTO;
import com.flowtrack.flowtrack.dto.UserRegisterDTO;
import com.flowtrack.flowtrack.model.Pessoa;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.PessoaRepository;
import com.flowtrack.flowtrack.repository.UserRepository;

import jakarta.transaction.Transactional;

import java.util.regex.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PessoaRepository pessoaRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    public UserService(UserRepository userRepository, PessoaRepository pessoaRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.pessoaRepository = pessoaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createUser(UserRegisterDTO dto) {
        System.out.println("[USER SERVICE] Iniciando criação de usuário");
        
        // Verifica se email é válido
        if (dto.getEmail() == null || !EMAIL_PATTERN.matcher(dto.getEmail()).matches()) {
            throw new IllegalArgumentException("O email informado é inválido.");
        }

        // Verifica se já existe
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Este email já está cadastrado.");
        }

        // Valida se nome e senha estão presentes
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
        
        if (dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória.");
        }

        System.out.println("[USER SERVICE] Criando Pessoa...");
        // Cria Pessoa
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(dto.getNome());
        pessoa.setCpf(dto.getCpf());
        pessoa.setDataNascimento(dto.getDataNascimento());
        pessoa.setTelefone(dto.getTelefone());
        pessoa.setEndereco(dto.getEndereco());
        Pessoa savedPessoa = pessoaRepository.save(pessoa);
        System.out.println("[USER SERVICE] Pessoa criada com ID: " + savedPessoa.getId());

        System.out.println("[USER SERVICE] Criando User com senha hasheada...");
        // Cria User com senha hasheada
        User user = new User();
        user.setEmail(dto.getEmail());
        String senhaHash = passwordEncoder.encode(dto.getSenha());
        user.setSenha(senhaHash); // Hash da senha
        System.out.println("[USER SERVICE] Senha hasheada: " + senhaHash.substring(0, 20) + "...");
        user.setRole("USER");
        user.setPessoa(savedPessoa);

        User savedUser = userRepository.save(user);
        System.out.println("[USER SERVICE] User criado com ID: " + savedUser.getId());
        
        return savedUser;
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    public Page<User> searchUsers(String query, Pageable pageable) {
        String searchQuery = "%" + query.toLowerCase() + "%";
        
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

        if (dto.getNome() != null && !dto.getNome().isBlank() && userToUpdate.getPessoa() != null) {
            userToUpdate.getPessoa().setNome(dto.getNome());
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
    
    public UserDTO toDTO(User user) {
        String nome = user.getPessoa() != null ? user.getPessoa().getNome() : null;
        return new UserDTO(user.getId(), nome, user.getEmail(), user.getRole());
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public Optional<User> authenticate(String email, String senha) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        
        User user = userOpt.get();
        
        // Verifica se a senha fornecida corresponde ao hash armazenado
        if (passwordEncoder.matches(senha, user.getSenha())) {
            return Optional.of(user);
        }
        
        return Optional.empty();
    }
}
