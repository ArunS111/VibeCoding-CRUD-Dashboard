# Data Model — Project Apex

## Entity: InventoryItem
Table: `inventory_items`

| Field       | Java Type     | DB Column    | Constraints                              |
|-------------|---------------|--------------|------------------------------------------|
| id          | Long          | id           | PK, IDENTITY auto-increment              |
| name        | String        | name         | NOT NULL, max 200 chars                  |
| sku         | String        | sku          | NOT NULL, UNIQUE, max 100 chars          |
| category    | String        | category     | NOT NULL, max 100 chars                  |
| price       | BigDecimal    | price        | NOT NULL, precision 10 scale 2, min 0.00 |
| quantity    | Integer       | quantity     | NOT NULL, min 0                          |
| imageUrl    | String        | image_url    | NULLABLE, max 500 chars (stretch)        |
| createdAt   | LocalDateTime | created_at   | NOT NULL, set on @PrePersist             |
| updatedAt   | LocalDateTime | updated_at   | NOT NULL, updated on @PreUpdate          |

### Derived Field: StockStatus (not persisted — computed in service)
```java
public enum StockStatus {
    IN_STOCK,    // quantity > 10
    LOW_STOCK,   // 1 <= quantity <= 10
    OUT_OF_STOCK // quantity == 0
}
```

Threshold constant: `LOW_STOCK_THRESHOLD = 10`

Derivation logic:
```java
if (quantity == 0)           return OUT_OF_STOCK;
if (quantity <= THRESHOLD)   return LOW_STOCK;
return IN_STOCK;
```

---

## Entity: ActivityLog (stretch)
Table: `activity_logs`

| Field      | Java Type     | DB Column   | Constraints             |
|------------|---------------|-------------|-------------------------|
| id         | Long          | id          | PK, IDENTITY            |
| action     | String        | action      | NOT NULL, max 50 chars  |
| itemName   | String        | item_name   | NOT NULL, max 200 chars |
| timestamp  | LocalDateTime | timestamp   | NOT NULL, @PrePersist   |

Example actions: `"created"`, `"updated"`, `"deleted"`

---

## DTOs (no table — request/response shapes)

### InventoryItemDTO (response)
```json
{
  "id": 1,
  "name": "T-Shirt",
  "sku": "TS-001",
  "category": "Apparel",
  "price": 19.99,
  "quantity": 5,
  "stockStatus": "LOW_STOCK",
  "imageUrl": null,
  "createdAt": "2025-01-01T10:00:00",
  "updatedAt": "2025-01-01T10:00:00"
}
```

### DashboardStatsDTO (response)
```json
{
  "totalItems": 42,
  "lowStockItems": 7,
  "outOfStockItems": 2
}
```

### CreateItemRequest / UpdateItemRequest (request)
```json
{
  "name": "T-Shirt",
  "sku": "TS-001",
  "category": "Apparel",
  "price": 19.99,
  "quantity": 50,
  "imageUrl": null
}
```

### BulkDeleteRequest (request, stretch)
```json
{ "ids": [1, 2, 3] }
```

### ActivityLogDTO (response, stretch)
```json
{ "id": 1, "action": "created", "itemName": "T-Shirt", "timestamp": "2025-01-01T10:00:00" }
```
