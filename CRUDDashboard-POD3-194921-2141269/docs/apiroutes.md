# API Routes — Project Apex

Base URL: `http://localhost:8080/api`

---

## GET /api/inventory
List all inventory items with optional filtering and sorting.

**Query Params:**
| Param    | Type   | Default | Description |
|----------|--------|---------|-------------|
| search   | String | null    | Filters name, SKU, or category (case-insensitive LIKE) |
| category | String | null    | Filter by exact category |
| sortBy   | String | name    | Sort field: name, sku, category, price, quantity |
| sortDir  | String | asc     | asc or desc |

**Response 200:**
```json
[
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
]
```

---

## POST /api/inventory
Create a new inventory item.

**Request Body (application/json):**
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

**Response 201:** `InventoryItemDTO`
**Error 400:** Validation failure
**Error 409:** Duplicate SKU

---

## GET /api/inventory/stats
Dashboard KPI aggregation. Must be defined BEFORE `/{id}` route in controller.

**Response 200:**
```json
{
  "totalItems": 42,
  "lowStockItems": 7,
  "outOfStockItems": 2
}
```

---

## GET /api/inventory/{id}
Get a single item by ID.

**Response 200:** `InventoryItemDTO`
**Error 404:** Item not found

---

## PUT /api/inventory/{id}
Update an existing item.

**Request Body:** Same fields as POST
**Response 200:** `InventoryItemDTO`
**Errors:** 400 (validation), 404 (not found), 409 (duplicate SKU on another item)

---

## DELETE /api/inventory/{id}
Delete a single item.

**Response 204:** No content
**Error 404:** Item not found

---

## DELETE /api/inventory/bulk
Bulk delete by list of IDs (stretch).

**Request Body:**
```json
{ "ids": [1, 2, 3] }
```
**Response 204:** No content

---

## GET /api/activity-log
Recent action log (stretch).

**Query Params:** `limit` (int, default 10)

**Response 200:**
```json
[
  { "id": 1, "action": "created", "itemName": "T-Shirt", "timestamp": "2025-01-01T10:00:00" }
]
```

---

## POST /api/inventory/{id}/image
Upload a product image (stretch).

**Body:** `multipart/form-data`, field name: `file`
**Response 200:** `{ "imageUrl": "/uploads/abc123.jpg" }`
**Error 404:** Item not found

---

## Standard Error Response Schema
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "InventoryItem with id 99 not found",
  "path": "/api/inventory/99",
  "timestamp": "2025-01-01T10:00:00"
}
```

## Controller Route Order (important — stats before {id})
1. GET  /api/inventory          → getAllItems
2. POST /api/inventory          → createItem
3. GET  /api/inventory/stats    → getStats        ← must be before /{id}
4. GET  /api/inventory/{id}     → getItemById
5. PUT  /api/inventory/{id}     → updateItem
6. DELETE /api/inventory/{id}   → deleteItem
7. DELETE /api/inventory/bulk   → bulkDelete
8. POST /api/inventory/{id}/image → uploadImage
