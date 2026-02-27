# UI Components — Project Apex

## Component Tree
```
App
├── QueryClientProvider (TanStack Query)
└── Layout
    ├── Header
    │   └── AppTitle + branding
    └── Dashboard (main page — owns search, sort, modal, selection state)
        ├── StatsBar
        │   ├── StatCard (Total Items)
        │   ├── StatCard (Low Stock) [warning variant]
        │   └── StatCard (Out of Stock) [danger variant]
        ├── InventoryControls
        │   ├── SearchBar
        │   └── AddItemButton → opens ItemModal (mode=create)
        ├── BulkDeleteBar [stretch — visible only when selectedIds.size > 0]
        ├── InventoryTable
        │   ├── ColumnHeader × 6 (Name, SKU, Category, Price, Qty, Actions)
        │   └── InventoryRow × N
        │       └── StockBadge
        ├── ItemModal (create / edit — controlled by modalState)
        ├── DeleteConfirmModal (controlled by deleteTarget)
        ├── CategoryChart [stretch]
        └── ActivityLog [stretch]
```

---

## Component Definitions

### `Header`
No props. Displays app name "Project Apex" and tagline.

### `StatsBar`
| Prop            | Type   |
|-----------------|--------|
| totalItems      | number |
| lowStockItems   | number |
| outOfStockItems | number |

### `StatCard`
| Prop    | Type                              | Description |
|---------|-----------------------------------|-------------|
| label   | string                            | Display label |
| value   | number                            | KPI value |
| variant | 'default' \| 'warning' \| 'danger' | Color scheme |
| icon    | ReactNode                         | Lucide icon |

### `SearchBar`
| Prop     | Type                    |
|----------|-------------------------|
| value    | string                  |
| onChange | (v: string) => void     |
| placeholder | string (optional)    |

### `InventoryTable`
| Prop        | Type                        | Description |
|-------------|-----------------------------|-------------|
| items        | InventoryItem[]             | Filtered, sorted list |
| onEdit       | (item: InventoryItem) => void |
| onDelete     | (item: InventoryItem) => void |
| selectedIds  | Set\<number\>               | Stretch |
| onSelectRow  | (id: number) => void        | Stretch |
| onSelectAll  | () => void                  | Stretch |
| sortConfig   | { key: string; dir: 'asc'\|'desc' } |
| onSort       | (key: string) => void       |

### `ColumnHeader`
| Prop        | Type                                    |
|-------------|-----------------------------------------|
| label       | string                                  |
| sortKey     | string \| null                          |
| sortConfig  | { key: string; dir: 'asc'\|'desc' }    |
| onSort      | (key: string) => void                   |

### `InventoryRow`
| Prop     | Type                          |
|----------|-------------------------------|
| item     | InventoryItem                 |
| onEdit   | (item: InventoryItem) => void |
| onDelete | (item: InventoryItem) => void |
| selected | boolean (stretch)             |
| onSelect | () => void (stretch)          |

**Row background classes:**
- `LOW_STOCK` → `bg-yellow-50 hover:bg-yellow-100`
- `OUT_OF_STOCK` → `bg-red-50 hover:bg-red-100`
- `IN_STOCK` → `bg-white hover:bg-gray-50`

### `StockBadge`
| Prop   | Type                                    |
|--------|-----------------------------------------|
| status | 'IN_STOCK' \| 'LOW_STOCK' \| 'OUT_OF_STOCK' |

Badge colours: IN_STOCK=green, LOW_STOCK=yellow, OUT_OF_STOCK=red.

### `ItemModal`
| Prop    | Type                           | Description |
|---------|--------------------------------|-------------|
| mode    | 'create' \| 'edit'             | Determines title and submit action |
| item    | InventoryItem \| null          | Pre-fills form fields in edit mode |
| onSave  | (data: ItemFormData) => void   | Fires on valid submit |
| onClose | () => void                     | Dismiss handler |

Fields: name (text), sku (text), category (text), price (number), quantity (number), imageUrl (text, stretch).

### `DeleteConfirmModal`
| Prop      | Type       |
|-----------|------------|
| itemName  | string     |
| onConfirm | () => void |
| onCancel  | () => void |

### `BulkDeleteBar` (stretch)
| Prop          | Type       |
|---------------|------------|
| selectedCount | number     |
| onBulkDelete  | () => void |
| onClearSelection | () => void |

### `CategoryChart` (stretch)
| Prop  | Type            | Description |
|-------|-----------------|-------------|
| items | InventoryItem[] | Full list, grouped by category |

Uses Recharts `BarChart` or `PieChart`.

### `ActivityLog` (stretch)
| Prop | Type             |
|------|------------------|
| logs | ActivityLogEntry[] |

Displays last 10 entries in a scrollable panel.

---

## UI Primitive Components (`src/components/ui/`)

### `Button`
Props: `variant` ('primary' | 'danger' | 'ghost'), `size` ('sm' | 'md'), `onClick`, `disabled`, `children`.

### `Modal`
Props: `title`, `onClose`, `children`. Renders backdrop + centred card.

### `Input`
Props: `label`, `name`, `value`, `onChange`, `error`, `type`, `placeholder`.

### `Badge`
Props: `label`, `color` ('green' | 'yellow' | 'red' | 'gray').

---

## State Ownership

| State                  | Location            | Mechanism         |
|------------------------|---------------------|-------------------|
| Inventory list         | TanStack Query      | GET /api/inventory|
| Dashboard stats        | TanStack Query      | GET /api/inventory/stats |
| Activity log           | TanStack Query      | GET /api/activity-log (stretch) |
| Search query           | Dashboard           | useState<string>  |
| Sort config            | Dashboard           | useState<{key, dir}> |
| Modal state (open/mode/item) | Dashboard     | useState          |
| Delete target          | Dashboard           | useState<InventoryItem \| null> |
| Selected row IDs       | Dashboard           | useState<Set<number>> (stretch) |
