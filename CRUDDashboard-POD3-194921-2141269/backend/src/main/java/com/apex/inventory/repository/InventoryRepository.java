package com.apex.inventory.repository;

import com.apex.inventory.model.InventoryItem;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    Optional<InventoryItem> findBySku(String sku);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    @Query("SELECT i FROM InventoryItem i WHERE " +
           "(:search IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.sku) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(i.category) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:category IS NULL OR i.category = :category)")
    List<InventoryItem> findBySearchAndCategory(
            @Param("search") String search,
            @Param("category") String category,
            Sort sort);

    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.quantity = 0")
    long countOutOfStock();

    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.quantity > 0 AND i.quantity <= :threshold")
    long countLowStock(@Param("threshold") int threshold);
}
