package com.apex.inventory.dto;

import com.apex.inventory.model.StockStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InventoryItemDTO {
    private Long id;
    private String name, sku, category, imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private StockStatus stockStatus;
    private LocalDateTime createdAt, updatedAt;

    public InventoryItemDTO() {}

    public InventoryItemDTO(Long id, String name, String sku, String category,
                            BigDecimal price, Integer quantity, StockStatus stockStatus,
                            String imageUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.name = name; this.sku = sku; this.category = category;
        this.price = price; this.quantity = quantity; this.stockStatus = stockStatus;
        this.imageUrl = imageUrl; this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name, sku, category, imageUrl;
        private BigDecimal price;
        private Integer quantity;
        private StockStatus stockStatus;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(Long v)                 { this.id = v; return this; }
        public Builder name(String v)             { this.name = v; return this; }
        public Builder sku(String v)              { this.sku = v; return this; }
        public Builder category(String v)         { this.category = v; return this; }
        public Builder price(BigDecimal v)        { this.price = v; return this; }
        public Builder quantity(Integer v)        { this.quantity = v; return this; }
        public Builder stockStatus(StockStatus v) { this.stockStatus = v; return this; }
        public Builder imageUrl(String v)         { this.imageUrl = v; return this; }
        public Builder createdAt(LocalDateTime v) { this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { this.updatedAt = v; return this; }

        public InventoryItemDTO build() {
            return new InventoryItemDTO(id, name, sku, category, price, quantity,
                    stockStatus, imageUrl, createdAt, updatedAt);
        }
    }

    public Long getId()                       { return id; }
    public void setId(Long v)                 { this.id = v; }
    public String getName()                   { return name; }
    public void setName(String v)             { this.name = v; }
    public String getSku()                    { return sku; }
    public void setSku(String v)              { this.sku = v; }
    public String getCategory()               { return category; }
    public void setCategory(String v)         { this.category = v; }
    public BigDecimal getPrice()              { return price; }
    public void setPrice(BigDecimal v)        { this.price = v; }
    public Integer getQuantity()              { return quantity; }
    public void setQuantity(Integer v)        { this.quantity = v; }
    public StockStatus getStockStatus()       { return stockStatus; }
    public void setStockStatus(StockStatus v) { this.stockStatus = v; }
    public String getImageUrl()               { return imageUrl; }
    public void setImageUrl(String v)         { this.imageUrl = v; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt()       { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
}
