package com.apex.inventory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public InventoryItem() {}

    public InventoryItem(Long id, String name, String sku, String category,
                         BigDecimal price, Integer quantity, String imageUrl,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.name = name; this.sku = sku; this.category = category;
        this.price = price; this.quantity = quantity; this.imageUrl = imageUrl;
        this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name, sku, category, imageUrl;
        private BigDecimal price;
        private Integer quantity;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(Long v)                { this.id = v; return this; }
        public Builder name(String v)            { this.name = v; return this; }
        public Builder sku(String v)             { this.sku = v; return this; }
        public Builder category(String v)        { this.category = v; return this; }
        public Builder price(BigDecimal v)       { this.price = v; return this; }
        public Builder quantity(Integer v)       { this.quantity = v; return this; }
        public Builder imageUrl(String v)        { this.imageUrl = v; return this; }
        public Builder createdAt(LocalDateTime v){ this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v){ this.updatedAt = v; return this; }

        public InventoryItem build() {
            return new InventoryItem(id, name, sku, category, price, quantity,
                    imageUrl, createdAt, updatedAt);
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
    public String getImageUrl()               { return imageUrl; }
    public void setImageUrl(String v)         { this.imageUrl = v; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt()       { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
}
