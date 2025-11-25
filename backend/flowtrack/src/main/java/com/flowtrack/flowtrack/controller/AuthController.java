package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.AuthResponseDTO;
import com.flowtrack.flowtrack.dto.LoginDTO;
import com.flowtrack.flowtrack.dto.UserDTO;
import com.flowtrack.flowtrack.dto.UserRegisterDTO;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.security.JwtTokenProvider;
import com.flowtrack.flowtrack.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Autenticação e registro de usuários")
public class AuthController {
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(UserService userService, JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
    }

   @PostMapping("/register")
    @Operation(summary = "Registrar usuário", description = "Cria um novo usuário com role USER")
    public ResponseEntity<?> register(@RequestBody UserRegisterDTO dto) {
        try {
            System.out.println("[AUTH] Recebida requisição de registro:");
            System.out.println("  - Nome: " + dto.getNome());
            System.out.println("  - Email: " + dto.getEmail());
            System.out.println("  - Senha: " + (dto.getSenha() != null ? "***" : "null"));
            
            User created = userService.createUser(dto);
            System.out.println("[AUTH] Usuário criado com sucesso:");
            System.out.println("  - ID: " + created.getId());
            System.out.println("  - Email: " + created.getEmail());
            System.out.println("  - Pessoa ID: " + (created.getPessoa() != null ? created.getPessoa().getId() : "null"));
            
            // Retorna apenas mensagem de sucesso, sem token
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Usuário criado com sucesso! Faça login para continuar."));
        } catch (IllegalArgumentException e) {
            // Erro de validação amigável
            System.out.println("[AUTH] Erro de validação: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Erro inesperado
            System.out.println("[AUTH] Erro inesperado ao registrar: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Ocorreu um erro ao registrar o usuário. Tente novamente."));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Login de usuário", description = "Autentica usuário pelo email e senha")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Optional<User> optionalUser = userService.authenticate(dto.getEmail(), dto.getSenha());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            UserDTO userDTO = userService.toDTO(user);
            String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
            AuthResponseDTO response = new AuthResponseDTO(token, userDTO);
            return ResponseEntity.ok(response);
        } else {
            // Retorna JSON de erro
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou senha incorretos"));
        }
    }
}
