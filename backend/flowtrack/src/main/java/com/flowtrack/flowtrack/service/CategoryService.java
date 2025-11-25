package com.flowtrack.flowtrack.service;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.flowtrack.flowtrack.dto.CategoryDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.model.Category;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.CategoryRepository;
import com.flowtrack.flowtrack.repository.UserRepository;
import com.flowtrack.flowtrack.util.SecurityUtil;

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
    public List<CategoryDTO> getVisibleCategories() {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        return categoryRepository.findVisibleCategoriesWithCount(currentUser);
    }

    @Transactional
    public Category createCategory(Category category) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }

        category.setUser(currentUser);
        
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long categoryId, Category updatedCategory) throws AccessDeniedException {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        Category existingCategory = categoryRepository.findByIdAndUser(categoryId, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + categoryId));

        existingCategory.setName(updatedCategory.getName());
        existingCategory.setColor(updatedCategory.getColor());
        
        return categoryRepository.save(existingCategory);
    }

    @Transactional
    public void deleteOrHideCategory(Long categoryId) throws AccessDeniedException {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuário não autenticado");
        }
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + categoryId));
        
        if (category.getUser() == null) {
            // Categoria global - esconder para o usuário
            currentUser.getHiddenCategories().add(category);
            userRepository.save(currentUser);
        } else if (category.getUser().getId().equals(currentUser.getId())) {
            // Categoria do usuário - deletar
            categoryRepository.delete(category);
        } else {
            throw new AccessDeniedException("Acesso negado para deletar a categoria com ID: " + categoryId);
        }
    }
}
