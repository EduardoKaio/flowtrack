package com.flowtrack.flowtrack.service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.flowtrack.flowtrack.dto.CategoryDTO;
import com.flowtrack.flowtrack.model.Category;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.CategoryRepository;
import com.flowtrack.flowtrack.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<CategoryDTO> getVisibleCategories(Long userId) {
        return categoryRepository.findVisibleCategoriesWithCount(userId);
    }

    @Transactional
    public Category createCategory(Category category, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + userId));

        System.out.println(category);

        category.setUser(user);
        
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long categoryId, Category updatedCategory, Long userId) throws AccessDeniedException {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + categoryId));
        
        if (!existingCategory.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado para atualizar a categoria com ID: " + categoryId);
        }

        existingCategory.setName(updatedCategory.getName());
        existingCategory.setColor(updatedCategory.getColor());
        
        return categoryRepository.save(existingCategory);
    }

    @Transactional
    public void deleteOrHideCategory(Long userId, Long categoryId) throws AccessDeniedException {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + categoryId));
        
        if (category.getUser() == null) {
            // Categoria global - esconder para o usuário
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + userId));

            user.getHiddenCategories().add(category);
            userRepository.save(user);
        } else if (category.getUser().getId().equals(userId)) {
            // Categoria do usuário - deletar
            categoryRepository.delete(category);
        } else {
            throw new AccessDeniedException("Acesso negado para deletar a categoria com ID: " + categoryId);
        }
    }
}
