package com.apex.inventory.controller;

import com.apex.inventory.dto.*;
import com.apex.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemDTO>> getAllItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(inventoryService.getAllItems(search, category, sortBy, sortDir));
    }

    @PostMapping
    public ResponseEntity<InventoryItemDTO> createItem(@Valid @RequestBody CreateItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createItem(request));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(inventoryService.getStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemDTO> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemDTO> updateItem(
            @PathVariable Long id, @Valid @RequestBody UpdateItemRequest request) {
        return ResponseEntity.ok(inventoryService.updateItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> bulkDelete(@RequestBody BulkDeleteRequest request) {
        inventoryService.bulkDelete(request.getIds());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<InventoryItemDTO> items = inventoryService.getAllItems(search, category, "name", "asc");
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        pw.println("ID,Name,SKU,Category,Price,Quantity,Stock Status,Created At");
        for (InventoryItemDTO i : items) {
            pw.printf("%d,\"%s\",\"%s\",\"%s\",%.2f,%d,%s,%s%n",
                    i.getId(),
                    escape(i.getName()),
                    escape(i.getSku()),
                    escape(i.getCategory()),
                    i.getPrice(),
                    i.getQuantity(),
                    i.getStockStatus(),
                    i.getCreatedAt());
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDisposition(ContentDisposition.attachment().filename("inventory.csv").build());
        return ResponseEntity.ok().headers(headers).body(sw.toString());
    }

    @PostMapping("/import/csv")
    public ResponseEntity<ImportResultDTO> importCsv(@RequestParam("file") MultipartFile file) {
        ImportResultDTO result = inventoryService.importCsv(file);
        return ResponseEntity.ok(result);
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\"", "\"\"");
    }
}
