package com.flowtrack.flowtrack.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flowtrack.flowtrack.dto.CategoryCreateDTO;
import com.flowtrack.flowtrack.model.Category;
import com.flowtrack.flowtrack.service.CategoryService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/categories")
@Tag(name = "Categories", description = "Gerenciamento de categorias")
public class CategoryController {
    
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<?> getVisibleCategories(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(categoryService.getVisibleCategories(userId));
        } catch (Exception e) {
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body("{\"message\": \"Erro ao buscar categorias.\"}");
        }
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestParam Long userId, @RequestBody CategoryCreateDTO categoryDTO) {
        try {
            System.out.println(categoryDTO);
            Category category = new Category();
            category.setName(categoryDTO.getName());
            category.setColor(categoryDTO.getColor());
            return ResponseEntity.ok(categoryService.createCategory(category, userId));
        } catch (Exception e) {
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body("{\"message\": \"Erro ao criar categoria.\"}");
        }
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<?> updateCategory(@RequestParam Long userId, @PathVariable Long categoryId, @RequestBody Category category) {
        try {
            return ResponseEntity.ok(categoryService.updateCategory(categoryId, category, userId));
        } catch (Exception e) {
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body("{\"message\": \"Erro ao atualizar categoria.\"}");
        }
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> deleteOrHideCategory(@RequestParam Long userId, @PathVariable Long categoryId) {
        try {
            categoryService.deleteOrHideCategory(userId, categoryId);
            return ResponseEntity.ok("{\"message\": \"Categoria deletada ou escondida com sucesso.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body("{\"message\": \"Erro ao deletar ou esconder categoria.\"}");
        }
    }
}
