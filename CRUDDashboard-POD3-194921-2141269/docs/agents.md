# Agent Roles — Project Apex

## Execution Order
```
Phase 2 Start
  ├── Backend Agent   ──────────────────── (no deps, starts immediately)
  ├── Infra Agent     ──────────────────── (no deps, starts immediately)
  │
  └── [after backend ships API contracts]
      └── UI Agent    ──────────────────── (depends on apiroutes.md)
          │
          └── [after each module ships]
              └── QA Agent ──────────────  (runs continuously)
```

---

## Agent 1: Backend Agent
**Ownership:** `backend/`
**Stack:** Java 17, Spring Boot 3.2, Maven, Spring Data JPA, PostgreSQL, Lombok

**Deliverables:**
```
backend/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── java/com/apex/inventory/
    │   │   ├── InventoryApplication.java
    │   │   ├── config/CorsConfig.java
    │   │   ├── controller/
    │   │   │   ├── InventoryController.java
    │   │   │   └── ActivityLogController.java
    │   │   ├── dto/
    │   │   │   ├── InventoryItemDTO.java
    │   │   │   ├── CreateItemRequest.java
    │   │   │   ├── UpdateItemRequest.java
    │   │   │   ├── DashboardStatsDTO.java
    │   │   │   └── BulkDeleteRequest.java
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   ├── ResourceNotFoundException.java
    │   │   │   └── DuplicateSkuException.java
    │   │   ├── model/
    │   │   │   ├── InventoryItem.java
    │   │   │   ├── ActivityLog.java
    │   │   │   └── StockStatus.java
    │   │   ├── repository/
    │   │   │   ├── InventoryRepository.java
    │   │   │   └── ActivityLogRepository.java
    │   │   └── service/
    │   │       ├── InventoryService.java
    │   │       └── ActivityLogService.java
    │   └── resources/
    │       ├── application.yml
    │       └── application-test.yml
    └── test/
        └── java/com/apex/inventory/
            ├── InventoryApplicationTests.java
            ├── service/InventoryServiceTest.java
            └── controller/InventoryControllerIT.java
```

**Interface Contract:**
- Exposes all endpoints from `apiroutes.md`
- All responses use `InventoryItemDTO` with derived `stockStatus`
- Error responses follow the standard error schema

---

## Agent 2: UI Agent
**Ownership:** `frontend/`
**Stack:** React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Zustand, TanStack Query, Axios
**Dependency:** apiroutes.md approved and backend structure known

**Deliverables:**
```
frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── index.html
├── Dockerfile
├── nginx.conf
└── src/
    ├── types/inventory.ts
    ├── services/api.ts
    ├── store/inventoryStore.ts
    ├── hooks/useInventory.ts
    ├── components/
    │   ├── ui/ (Button, Modal, Input, Badge)
    │   ├── layout/Header.tsx
    │   ├── dashboard/ (StatsBar, StatCard, SearchBar, CategoryChart)
    │   ├── inventory/ (InventoryTable, ColumnHeader, InventoryRow, StockBadge, BulkDeleteBar)
    │   ├── modals/ (ItemModal, DeleteConfirmModal)
    │   └── activity/ (ActivityLog)
    └── App.tsx
```

**Interface Contract:**
- Reads `VITE_API_BASE_URL` for all API calls (default: `http://localhost:8080`)
- All types derived from backend DTOs documented in `datamodel.md`
- Low stock highlight: qty ≤ 10 → yellow; qty = 0 → red

---

## Agent 3: QA Agent
**Ownership:** test files across all layers
**Stack:** Vitest + React Testing Library (frontend), JUnit 5 + Mockito + Testcontainers (backend), Playwright (E2E)
**Dependency:** Runs after each agent completes a module

**Deliverables:**
```
frontend/src/**/*.test.tsx     (Vitest)
backend/src/test/java/**       (JUnit 5 + Testcontainers)
e2e/
├── playwright.config.ts
└── tests/
    ├── create-item.spec.ts
    ├── edit-item.spec.ts
    ├── delete-item.spec.ts
    ├── search-filter.spec.ts
    └── low-stock-highlight.spec.ts
```

**Coverage targets:**
- StatsBar, InventoryRow (highlight logic), ItemModal (create + edit), SearchBar, DeleteConfirmModal
- InventoryService (deriveStockStatus, createItem, getStats)
- InventoryController integration: POST 201, GET search, DELETE 204, PUT 409

---

## Agent 4: Infra Agent
**Ownership:** `docker-compose.yml`, `.github/workflows/`, Dockerfiles
**Dependency:** None — starts in parallel with Backend Agent

**Deliverables:**
```
docker-compose.yml
.env.example
.github/
└── workflows/
    └── ci.yml
frontend/
├── Dockerfile
└── nginx.conf
backend/
└── Dockerfile
```

**Interface Contract:**
- `backend` service: image built from `backend/Dockerfile`, env vars `SPRING_DATASOURCE_*`
- `frontend` service: nginx:alpine, proxies `/api` to `backend:8080`
- `db` service: `postgres:15`, volume `apex-db-data`, env `POSTGRES_*`
- Network: `apex-net` (bridge)
- CI jobs: frontend (lint+test+build), backend (mvn test+package), e2e (compose+playwright)
