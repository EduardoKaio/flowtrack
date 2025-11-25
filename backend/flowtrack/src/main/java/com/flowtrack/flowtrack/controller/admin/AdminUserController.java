package com.flowtrack.flowtrack.controller.admin;

import com.flowtrack.flowtrack.dto.UserDTO;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Admin Users", description = "Gerenciamento de usuários para administradores")
public class AdminUserController {
    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Listar usuários", description = "Retorna a lista paginada de todos os usuários, com filtro opcional")
    public ResponseEntity<Page<UserDTO>> listUsers(
            @RequestParam(name = "query", required = false) String query,
            @PageableDefault(size = 10, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<User> userPage;


        if (query != null && !query.isBlank()) {

            userPage = userService.searchUsers(query, pageable); 
        } else {
            // Senão, chame o método padrão que você já tem
            userPage = userService.getAllUsers(pageable);
        }


        Page<UserDTO> userDtoPage = userPage.map(userService::toDTO);
        return ResponseEntity.ok(userDtoPage);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter usuário", description = "Retorna os detalhes de um usuário pelo ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Usuário não encontrado.\"}");
        }

        User user = userOptional.get();
        UserDTO userDTO = userService.toDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar usuário", description = "Atualiza os dados de um usuário existente. Apenas os campos fornecidos serão atualizados.")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        System.out.println("Recebendo requisição para atualizar usuário com ID: " + id);
        System.out.println("Dados do DTO: " + dto);
        // Chama o novo método do serviço que faz tudo
        Optional<User> updatedUserOptional = userService.updateUserFromDTO(id, dto);

        // Verifica se o serviço encontrou o usuário
        if (updatedUserOptional.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Usuário não encontrado.\"}");
        }

        // Converte a entidade (User) de volta para DTO para a resposta
        User updatedUser = updatedUserOptional.get();
        UserDTO responseDTO = userService.toDTO(updatedUser);
        
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir usuário", description = "Remove um usuário pelo ID")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Usuário não encontrado.\"}");
        }

        User user = userOptional.get();
        if (user.getRole().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.badRequest().body("{\"message\": \"Não é possível excluir um administrador.\"}");
        }

        userService.deleteUser(id);
        return ResponseEntity.ok().body("{\"message\": \"Usuário excluído com sucesso.\"}");
    }
}