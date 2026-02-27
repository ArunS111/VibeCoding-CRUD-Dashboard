# Requirements — Project Apex: The Intelligent Inventory Hub

## Overview

A single-page inventory management dashboard that enables store managers to view, create,
update, and delete stock items with real-time insights into inventory health.

---

## Functional Requirements

### FR-01 Dashboard View

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01.1 | Display total unique item count in a stats header | Must |
| FR-01.2 | Display count of items with quantity ≤ 10 (low stock) | Must |
| FR-01.3 | Display count of items with quantity = 0 (out of stock) | Must |
| FR-01.4 | Render all inventory items in a sortable table | Must |
| FR-01.5 | Table columns: Name, SKU, Category, Price, Quantity | Must |
| FR-01.6 | Search bar that filters the table in real-time across Name, SKU, Category | Must |

### FR-02 CRUD Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-02.1 | Add a new item via a form/modal with fields: Name, SKU, Category, Price, Quantity, Image URL | Must |
| FR-02.2 | Edit an existing item using an Edit button on each table row | Must |
| FR-02.3 | Delete an item using a Delete button with a confirmation prompt | Must |
| FR-02.4 | SKU must be unique across all items | Must |
| FR-02.5 | Name, SKU, Category are required; Price ≥ 0; Quantity ≥ 0 | Must |

### FR-03 Low Stock Alerts

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-03.1 | Highlight table rows with yellow background when quantity is 1–10 | Must |
| FR-03.2 | Highlight table rows with red background when quantity is 0 | Must |
| FR-03.3 | Show a toast notification when a saved item drops to LOW_STOCK or OUT_OF_STOCK | Must |

### FR-04 Data Visualisation (Stretch)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-04.1 | Bar chart showing total quantity per category | Should |
| FR-04.2 | Pie/donut chart showing item count by stock status (In Stock / Low / Out) | Should |

### FR-05 Bulk Operations (Stretch)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-05.1 | Checkbox per row to select multiple items | Should |
| FR-05.2 | Bulk delete selected items with a single action | Should |
| FR-05.3 | Export current inventory view to CSV | Should |
| FR-05.4 | Import items from a CSV file (supports exported format and 5-column simple format) | Should |

### FR-06 Activity Log (Stretch)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-06.1 | Display the 10 most recent actions (created / updated / deleted / imported) | Should |
| FR-06.2 | Each entry shows: action type, item name, timestamp | Should |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Frontend must load in under 2 seconds on localhost |
| NFR-02 | All API responses must return within 500 ms for up to 1,000 items |
| NFR-03 | UI must be responsive down to 768 px viewport width |
| NFR-04 | Backend must validate all input and return structured error responses (400 / 409 / 404) |
| NFR-05 | CORS must be configured to allow only known frontend origins |

---

## Stock Status Rules

| Status | Condition |
|--------|-----------|
| `IN_STOCK` | quantity > 10 |
| `LOW_STOCK` | 1 ≤ quantity ≤ 10 |
| `OUT_OF_STOCK` | quantity = 0 |

Stock status is derived at read time; it is not stored in the database.

---

## Data Model

### InventoryItem

| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | Auto-generated PK |
| name | String | Required, max 200 chars |
| sku | String | Required, unique, max 100 chars |
| category | String | Required, max 100 chars |
| price | Decimal(10,2) | Required, ≥ 0 |
| quantity | Integer | Required, ≥ 0 |
| imageUrl | String | Optional, max 500 chars |
| createdAt | DateTime | Auto-set on create |
| updatedAt | DateTime | Auto-set on update |

### ActivityLog

| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | Auto-generated PK |
| action | String | One of: created, updated, deleted, imported |
| itemName | String | Name of the affected item |
| timestamp | DateTime | Auto-set on persist |

---

## API Surface

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/inventory` | List all items (search, category, sort params) |
| POST | `/api/inventory` | Create item |
| GET | `/api/inventory/stats` | Dashboard KPIs |
| GET | `/api/inventory/{id}` | Get single item |
| PUT | `/api/inventory/{id}` | Update item |
| DELETE | `/api/inventory/{id}` | Delete item |
| DELETE | `/api/inventory/bulk` | Bulk delete by ID list |
| GET | `/api/inventory/export/csv` | Download CSV |
| POST | `/api/inventory/import/csv` | Upload CSV for bulk import |
| GET | `/api/activity-log` | Recent activity entries |

---

## Implementation Status

| Requirement | Status |
|-------------|--------|
| FR-01 Dashboard + stats | ✅ Done |
| FR-02 Full CRUD | ✅ Done |
| FR-03 Low stock highlights + toasts | ✅ Done |
| FR-04 Bar chart (qty by category) | ✅ Done |
| FR-04 Pie chart (stock status) | ✅ Done |
| FR-05 Bulk delete | ✅ Done |
| FR-05 CSV export | ✅ Done |
| FR-05 CSV import | ✅ Done |
| FR-06 Activity log | ✅ Done |
