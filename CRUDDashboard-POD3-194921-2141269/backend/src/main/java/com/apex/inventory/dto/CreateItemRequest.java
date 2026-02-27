package com.apex.inventory.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreateItemRequest {

    public CreateItemRequest() {}

    public CreateItemRequest(String name, String sku, String category,
                             BigDecimal price, Integer quantity, String imageUrl) {
        this.name = name; this.sku = sku; this.category = category;
        this.price = price; this.quantity = quantity; this.imageUrl = imageUrl;
    }

    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    private String name;

    @NotBlank(message = "SKU is required")
    @Size(max = 100, message = "SKU must not exceed 100 characters")
    private String sku;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price must be 0 or greater")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be 0 or greater")
    private Integer quantity;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    public String getName()             { return name; }
    public void setName(String v)       { this.name = v; }
    public String getSku()              { return sku; }
    public void setSku(String v)        { this.sku = v; }
    public String getCategory()         { return category; }
    public void setCategory(String v)   { this.category = v; }
    public BigDecimal getPrice()        { return price; }
    public void setPrice(BigDecimal v)  { this.price = v; }
    public Integer getQuantity()        { return quantity; }
    public void setQuantity(Integer v)  { this.quantity = v; }
    public String getImageUrl()         { return imageUrl; }
    public void setImageUrl(String v)   { this.imageUrl = v; }
}
