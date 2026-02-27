package com.apex.inventory.service;

import com.apex.inventory.dto.*;
import com.apex.inventory.exception.*;
import com.apex.inventory.model.*;
import com.apex.inventory.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;
    @Mock
    private ActivityLogService activityLogService;
    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void deriveStockStatus_outOfStock_whenQuantityZero() {
        assertThat(inventoryService.deriveStockStatus(0)).isEqualTo(StockStatus.OUT_OF_STOCK);
    }

    @Test
    void deriveStockStatus_lowStock_whenQuantityAtThreshold() {
        assertThat(inventoryService.deriveStockStatus(10)).isEqualTo(StockStatus.LOW_STOCK);
    }

    @Test
    void deriveStockStatus_lowStock_whenQuantityOne() {
        assertThat(inventoryService.deriveStockStatus(1)).isEqualTo(StockStatus.LOW_STOCK);
    }

    @Test
    void deriveStockStatus_inStock_whenQuantityAboveThreshold() {
        assertThat(inventoryService.deriveStockStatus(11)).isEqualTo(StockStatus.IN_STOCK);
    }

    @Test
    void createItem_throwsDuplicateSku_whenSkuExists() {
        CreateItemRequest request = new CreateItemRequest("Item", "SKU-001", "Cat", BigDecimal.TEN, 5, null);
        when(inventoryRepository.existsBySku("SKU-001")).thenReturn(true);
        assertThatThrownBy(() -> inventoryService.createItem(request))
                .isInstanceOf(DuplicateSkuException.class);
    }

    @Test
    void getItemById_throwsNotFound_whenNotExists() {
        when(inventoryRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> inventoryService.getItemById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getStats_returnsCorrectCounts() {
        when(inventoryRepository.count()).thenReturn(42L);
        when(inventoryRepository.countOutOfStock()).thenReturn(2L);
        when(inventoryRepository.countLowStock(10)).thenReturn(7L);
        DashboardStatsDTO stats = inventoryService.getStats();
        assertThat(stats.getTotalItems()).isEqualTo(42L);
        assertThat(stats.getOutOfStockItems()).isEqualTo(2L);
        assertThat(stats.getLowStockItems()).isEqualTo(7L);
    }
}
