package com.flowtrack.flowtrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.flowtrack.flowtrack.dto.CategoryDTO;
import com.flowtrack.flowtrack.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT new com.flowtrack.flowtrack.dto.CategoryDTO(" +
           "    c.id, c.name, c.color, " +
           "    CASE WHEN c.user IS NULL THEN true ELSE false END, " +
           "    COUNT(t) " +
           ") " +
           "FROM Category c " +
           "LEFT JOIN Task t ON t.category = c " +
           "WHERE (c.user.id = :userId " +
           "       OR (c.user IS NULL AND c.id NOT IN " +
           "           (SELECT hc.id FROM User u JOIN u.hiddenCategories hc WHERE u.id = :userId))) " +
           "GROUP BY c.id, c.name, c.color, c.user")
    List<CategoryDTO> findVisibleCategoriesWithCount(@Param("userId") Long userId);
}
