package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.LoginDTO;
import com.flowtrack.flowtrack.dto.UserDTO;
import com.flowtrack.flowtrack.dto.UserRegisterDTO;
import com.flowtrack.flowtrack.model.User;
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

    public AuthController(UserService userService) {
        this.userService = userService;
    }

   @PostMapping("/register")
    @Operation(summary = "Registrar usuário", description = "Cria um novo usuário com role USER")
    public ResponseEntity<?> register(@RequestBody UserRegisterDTO dto) {
        try {
            User user = new User();
            user.setNome(dto.getNome());
            user.setEmail(dto.getEmail());
            user.setSenha(dto.getSenha());
            user.setRole("USER");

            User created = userService.createUser(user);
            UserDTO response = new UserDTO(created.getId(), created.getNome(), created.getEmail(), created.getRole());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Erro de validação amigável
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Erro inesperado
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
            UserDTO response = new UserDTO(user.getId(), user.getNome(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(response);
        } else {
            // Retorna JSON de erro
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou senha incorretos"));
        }
    }
}
