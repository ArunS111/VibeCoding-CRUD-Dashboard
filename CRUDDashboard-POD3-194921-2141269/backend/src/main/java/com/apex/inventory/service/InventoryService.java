package com.apex.inventory.service;

import com.apex.inventory.dto.*;
import com.apex.inventory.exception.*;
import com.apex.inventory.model.*;
import com.apex.inventory.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
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

    @Transactional
    public ImportResultDTO importCsv(MultipartFile file) {
        int imported = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int lineNum = 0;
            while ((line = reader.readLine()) != null) {
                lineNum++;
                // Skip header row (starts with "ID" or "Name")
                if (lineNum == 1) continue;
                if (line.isBlank()) continue;

                try {
                    String[] cols = parseCsvLine(line);
                    // Support both export format (8 cols: id,name,sku,cat,price,qty,status,createdAt)
                    // and import format (5+ cols: name,sku,category,price,quantity[,imageUrl])
                    String name, sku, category, imageUrl = null;
                    BigDecimal price;
                    int quantity;

                    if (cols.length >= 6 && isNumeric(cols[0])) {
                        // Re-import of exported CSV: ID,Name,SKU,Category,Price,Quantity,...
                        name     = cols[1].trim();
                        sku      = cols[2].trim();
                        category = cols[3].trim();
                        price    = new BigDecimal(cols[4].trim());
                        quantity = Integer.parseInt(cols[5].trim());
                    } else if (cols.length >= 5) {
                        // Simple import: Name,SKU,Category,Price,Quantity[,ImageUrl]
                        name     = cols[0].trim();
                        sku      = cols[1].trim();
                        category = cols[2].trim();
                        price    = new BigDecimal(cols[3].trim());
                        quantity = Integer.parseInt(cols[4].trim());
                        if (cols.length > 5) imageUrl = cols[5].trim();
                    } else {
                        errors.add("Row " + lineNum + ": expected at least 5 columns, got " + cols.length);
                        skipped++;
                        continue;
                    }

                    if (name.isEmpty() || sku.isEmpty() || category.isEmpty()) {
                        errors.add("Row " + lineNum + ": name, sku, and category are required");
                        skipped++;
                        continue;
                    }

                    if (inventoryRepository.existsBySku(sku)) {
                        errors.add("Row " + lineNum + ": SKU '" + sku + "' already exists — skipped");
                        skipped++;
                        continue;
                    }

                    InventoryItem item = InventoryItem.builder()
                            .name(name).sku(sku).category(category)
                            .price(price).quantity(quantity).imageUrl(imageUrl)
                            .build();
                    inventoryRepository.save(item);
                    activityLogService.log("imported", name);
                    imported++;
                } catch (Exception e) {
                    errors.add("Row " + lineNum + ": " + e.getMessage());
                    skipped++;
                }
            }
        } catch (Exception e) {
            errors.add("Failed to read file: " + e.getMessage());
        }

        return new ImportResultDTO(imported, skipped, errors);
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

    /** Minimal CSV line parser that handles quoted fields. */
    private String[] parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    sb.append('"'); i++; // escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString());
        return fields.toArray(new String[0]);
    }

    private boolean isNumeric(String s) {
        try { Long.parseLong(s.trim()); return true; } catch (NumberFormatException e) { return false; }
    }
}
