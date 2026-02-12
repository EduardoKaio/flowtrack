package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.PasswordChangeDTO;
import com.flowtrack.flowtrack.dto.ProfileDTO;
import com.flowtrack.flowtrack.dto.ProfileUpdateDTO;
import com.flowtrack.flowtrack.model.Pessoa;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.PessoaRepository;
import com.flowtrack.flowtrack.repository.UserRepository;
import com.flowtrack.flowtrack.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PessoaRepository pessoaRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Diretório para salvar avatares (ajuste conforme necessário)
    private static final String UPLOAD_DIR = "uploads/avatars";
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Transactional(readOnly = true)
    public ProfileDTO getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findByIdWithPessoa(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pessoa pessoa = user.getPessoa();
        if (pessoa == null) {
            throw new RuntimeException("Dados pessoais não encontrados");
        }

        ProfileDTO dto = new ProfileDTO();
        dto.setId(user.getId());
        dto.setNome(pessoa.getNome());
        dto.setEmail(user.getEmail());
        dto.setBio(pessoa.getBio());
        dto.setLocation(pessoa.getLocation());
        dto.setAvatarUrl(pessoa.getAvatarUrl());
        dto.setTelefone(pessoa.getTelefone());
        dto.setEndereco(pessoa.getEndereco());
        
        // joinDate pode ser obtido de um campo created_at se existir
        // Por enquanto, vamos usar null ou a data atual
        dto.setJoinDate(null); // Pode ser implementado depois com campo created_at

        return dto;
    }

    @Transactional
    public ProfileDTO updateProfile(ProfileUpdateDTO updateDTO) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findByIdWithPessoa(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pessoa pessoa = user.getPessoa();
        if (pessoa == null) {
            throw new RuntimeException("Dados pessoais não encontrados");
        }

        // Atualiza apenas os campos fornecidos
        if (updateDTO.getNome() != null) {
            pessoa.setNome(updateDTO.getNome());
        }
        if (updateDTO.getBio() != null) {
            pessoa.setBio(updateDTO.getBio());
        }
        if (updateDTO.getLocation() != null) {
            pessoa.setLocation(updateDTO.getLocation());
        }
        if (updateDTO.getTelefone() != null) {
            pessoa.setTelefone(updateDTO.getTelefone());
        }
        if (updateDTO.getEndereco() != null) {
            pessoa.setEndereco(updateDTO.getEndereco());
        }

        pessoaRepository.save(pessoa);

        return getProfile();
    }

    @Transactional
    public String uploadAvatar(MultipartFile file) {
        // Validar arquivo
        validateImageFile(file);

        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findByIdWithPessoa(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pessoa pessoa = user.getPessoa();
        if (pessoa == null) {
            throw new RuntimeException("Dados pessoais não encontrados");
        }

        try {
            // Criar diretório se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Salvar arquivo
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Construir URL (ajuste conforme sua configuração)
            String avatarUrl = "/api/uploads/avatars/" + filename;

            // Atualizar pessoa
            pessoa.setAvatarUrl(avatarUrl);
            pessoaRepository.save(pessoa);

            return avatarUrl;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void changePassword(PasswordChangeDTO passwordDTO) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verificar senha atual
        if (!passwordEncoder.matches(passwordDTO.getCurrentPassword(), user.getSenha())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        // Validar nova senha
        if (passwordDTO.getNewPassword() == null || passwordDTO.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres");
        }

        // Atualizar senha
        user.setSenha(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(user);
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo não pode ser vazio");
        }

        // Validar tamanho
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Arquivo muito grande. Tamanho máximo: 5MB");
        }

        // Validar tipo de conteúdo
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, GIF, WEBP) são aceitas");
        }

        // Validar extensão do arquivo
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
            if (!allowedExtensions.contains(extension)) {
                throw new IllegalArgumentException("Extensão de arquivo não permitida. Use: JPG, PNG, GIF ou WEBP");
            }
        }
    }
}
