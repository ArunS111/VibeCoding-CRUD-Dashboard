package com.apex.inventory.service;

import com.apex.inventory.dto.*;
import com.apex.inventory.exception.*;
import com.apex.inventory.model.*;
import com.apex.inventory.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InventoryService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final InventoryRepository inventoryRepository;
    private final ActivityLogService activityLogService;

    public InventoryService(InventoryRepository inventoryRepository,
                            ActivityLogService activityLogService) {
        this.inventoryRepository = inventoryRepository;
        this.activityLogService = activityLogService;
    }

    public List<InventoryItemDTO> getAllItems(String search, String category, String sortBy, String sortDir) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String resolvedSortBy = resolveSortField(sortBy);
        Sort sort = Sort.by(direction, resolvedSortBy);
        return inventoryRepository.findBySearchAndCategory(
                (search != null && search.isBlank()) ? null : search,
                (category != null && category.isBlank()) ? null : category,
                sort
        ).stream().map(this::toDTO).toList();
    }

    @Transactional
    public InventoryItemDTO createItem(CreateItemRequest request) {
        if (inventoryRepository.existsBySku(request.getSku())) {
            throw new DuplicateSkuException(request.getSku());
        }
        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .sku(request.getSku())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(request.getImageUrl())
                .build();
        InventoryItem saved = inventoryRepository.save(item);
        activityLogService.log("created", saved.getName());
        return toDTO(saved);
    }

    public InventoryItemDTO getItemById(Long id) {
        return toDTO(findById(id));
    }

    @Transactional
    public InventoryItemDTO updateItem(Long id, UpdateItemRequest request) {
        InventoryItem item = findById(id);
        if (inventoryRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new DuplicateSkuException(request.getSku());
        }
        item.setName(request.getName());
        item.setSku(request.getSku());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        item.setImageUrl(request.getImageUrl());
        InventoryItem saved = inventoryRepository.save(item);
        activityLogService.log("updated", saved.getName());
        return toDTO(saved);
    }

    @Transactional
    public void deleteItem(Long id) {
        InventoryItem item = findById(id);
        activityLogService.log("deleted", item.getName());
        inventoryRepository.deleteById(id);
    }

    @Transactional
    public void bulkDelete(List<Long> ids) {
        inventoryRepository.deleteAllById(ids);
    }

    public DashboardStatsDTO getStats() {
        long total = inventoryRepository.count();
        long outOfStock = inventoryRepository.countOutOfStock();
        long lowStock = inventoryRepository.countLowStock(LOW_STOCK_THRESHOLD);
        return DashboardStatsDTO.builder()
                .totalItems(total)
                .lowStockItems(lowStock)
                .outOfStockItems(outOfStock)
                .build();
    }

    public StockStatus deriveStockStatus(int quantity) {
        if (quantity == 0) return StockStatus.OUT_OF_STOCK;
        if (quantity <= LOW_STOCK_THRESHOLD) return StockStatus.LOW_STOCK;
        return StockStatus.IN_STOCK;
    }

    private InventoryItem findById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem with id " + id + " not found"));
    }

    private InventoryItemDTO toDTO(InventoryItem item) {
        return InventoryItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .sku(item.getSku())
                .category(item.getCategory())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .stockStatus(deriveStockStatus(item.getQuantity()))
                .imageUrl(item.getImageUrl())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private String resolveSortField(String sortBy) {
        return switch (sortBy == null ? "name" : sortBy.toLowerCase()) {
            case "sku"      -> "sku";
            case "category" -> "category";
            case "price"    -> "price";
            case "quantity" -> "quantity";
            default         -> "name";
        };
    }
}
