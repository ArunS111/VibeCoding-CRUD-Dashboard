# Architecture — Project Apex

## System Overview
Single-Page Application (SPA) with a decoupled REST backend.

```
┌─────────────────────────────────────────────────────┐
│                  Browser (React SPA)                │
│  Vite / React 18 / Zustand / TanStack Query / Axios │
│  Port: 5173 (dev) | 80 (prod via nginx)             │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/JSON REST (CORS enabled)
┌────────────────────▼────────────────────────────────┐
│             Spring Boot API Server                  │
│  Java 17 / Spring MVC / Spring Data JPA             │
│  Port: 8080                                         │
└────────────────────┬────────────────────────────────┘
                     │ JDBC / HikariCP
┌────────────────────▼────────────────────────────────┐
│                  PostgreSQL 15                      │
│  Port: 5432                                         │
└─────────────────────────────────────────────────────┘
```

## Data Flow
1. User action (e.g., create item) triggers a form submit in React.
2. TanStack Query mutation fires Axios POST /api/inventory.
3. Spring Boot validates request DTO → calls InventoryService.
4. InventoryService persists via InventoryRepository (JPA).
5. ActivityLogService records the action (stretch).
6. Response DTO returned → TanStack Query invalidates cache.
7. UI re-renders with fresh data from GET /api/inventory.

## Service Boundaries
- **InventoryService** — CRUD, stock status derivation, stats aggregation.
- **ActivityLogService** — writes log entries; exposes last-N query (stretch).
- **ImageService** — handles multipart upload, stores file, returns URL (stretch).

## Frontend Structure
```
src/
├── types/          # TypeScript interfaces (InventoryItem, DashboardStats, etc.)
├── services/       # api.ts — all Axios calls, one function per endpoint
├── store/          # Zustand stores — UI state (modals, search, sort, selection)
├── hooks/          # TanStack Query hooks — useInventory, useStats, useMutations
├── components/
│   ├── ui/         # Primitives: Button, Modal, Input, Badge
│   ├── layout/     # Header
│   ├── dashboard/  # StatsBar, StatCard, SearchBar, CategoryChart
│   ├── inventory/  # InventoryTable, ColumnHeader, InventoryRow, StockBadge, BulkDeleteBar
│   ├── modals/     # ItemModal, DeleteConfirmModal
│   └── activity/   # ActivityLog (stretch)
└── App.tsx
```

## Backend Package Structure
```
com.apex.inventory/
├── config/         # CorsConfig
├── controller/     # InventoryController, ActivityLogController
├── dto/            # Request/Response DTOs
├── exception/      # GlobalExceptionHandler, custom exceptions
├── model/          # JPA entities, StockStatus enum
├── repository/     # Spring Data JPA repositories
└── service/        # Business logic
```

## Target Environments
| Env        | Frontend         | Backend             | DB                  |
|------------|------------------|---------------------|---------------------|
| Local Dev  | Vite dev server  | mvn spring-boot:run | Docker (postgres:15)|
| CI         | npm run build    | mvn test            | H2 in-memory        |
| Production | nginx container  | Spring Boot container | PostgreSQL container|
