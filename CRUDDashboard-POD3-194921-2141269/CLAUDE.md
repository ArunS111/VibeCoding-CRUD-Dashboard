# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Apex: The Intelligent Inventory Hub**

A single-page React dashboard backed by a Java Spring Boot REST API and PostgreSQL. Business owners can manage inventory with full CRUD, real-time search, low-stock alerts, data visualisation, bulk delete, and an activity log.

Full spec: [projectbrief.md](projectbrief.md) | Architecture: [docs/architecture.md](docs/architecture.md)

---

## Commands

### Frontend (`frontend/`)
```bash
npm install           # Install dependencies
npm run dev           # Vite dev server → http://localhost:5173 (proxies /api to :8080)
npm run build         # TypeScript compile + Vite production build → dist/
npm run lint          # ESLint (TypeScript + React rules)
npm run test          # Vitest unit tests (single run)
npm run test:watch    # Vitest in watch mode
npm run test:ui       # Vitest UI
```

### Backend (`backend/`)
```bash
mvn spring-boot:run                       # Dev server → http://localhost:8080
mvn test                                  # JUnit 5 unit + integration tests
mvn test -Dspring.profiles.active=test    # Force H2 in-memory (no PostgreSQL needed)
mvn package -DskipTests                   # Build JAR → target/*.jar
```

### Full Stack (Docker Compose — project root)
```bash
cp .env.example .env                  # One-time setup
docker compose up --build             # Build images + start db:5432, backend:8080, frontend:80
docker compose up -d                  # Detached mode
docker compose logs -f                # Tail all service logs
docker compose down                   # Stop containers
docker compose down -v                # Stop + delete volumes (wipes DB data)
```

### E2E Tests (`e2e/`)
```bash
npm install                   # Install Playwright
npx playwright install        # Download browsers
npm run test                  # Run all specs (requires full stack on :80)
npm run test:headed           # Headed mode for debugging
```

---

## Architecture

```
frontend/ (React 18 + Vite 5 + TypeScript + Tailwind CSS 3)
    src/types/          ← TypeScript interfaces matching backend DTOs
    src/services/api.ts ← All Axios calls, one function per endpoint
    src/store/          ← Zustand (UI state: modals, sort, selection)
    src/hooks/          ← TanStack Query hooks (server state + mutations)
    src/components/
        ui/             ← Primitives: Button, Modal, Input, Badge
        layout/         ← Header
        dashboard/      ← StatsBar, StatCard, SearchBar, CategoryChart
        inventory/      ← InventoryTable, InventoryRow, StockBadge, BulkDeleteBar
        modals/         ← ItemModal (create+edit shared), DeleteConfirmModal
        activity/       ← ActivityLog (stretch)

backend/ (Java 17 + Spring Boot 3.2 + Maven)
    model/              ← JPA entities (InventoryItem, ActivityLog) + StockStatus enum
    repository/         ← Spring Data JPA with custom JPQL for search/filter/count
    service/            ← InventoryService (CRUD, stats, deriveStockStatus), ActivityLogService
    controller/         ← InventoryController (/api/inventory/**), ActivityLogController
    dto/                ← Request/Response DTOs with Jakarta validation annotations
    exception/          ← GlobalExceptionHandler, ResourceNotFoundException, DuplicateSkuException
    config/             ← CorsConfig (allows :5173 and :80)

docs/                ← 7 planning docs (techstack, architecture, dependencies, datamodel,
                        apiroutes, uicomponents, agents)
e2e/                 ← Playwright E2E tests (5 specs: create, edit, delete, search, low-stock)
docker-compose.yml   ← db + backend + frontend on network apex-net, volume apex-db-data
.github/workflows/ci.yml ← CI: frontend (lint+test+build), backend (mvn test+package), e2e jobs
```

## Key Patterns

- **Stock status** is derived in `InventoryService.deriveStockStatus(quantity)` — not stored in DB. Threshold = 10 units.
- **Search** is client-side `useMemo` filter in `App.tsx` — fast, no extra API round-trips while typing.
- **Sort** is passed as query params to the backend (`sortBy`, `sortDir`) and handled via Spring Data `Sort`.
- **TanStack Query** invalidates `['inventory']`, `['stats']`, and `['activity-log']` keys after every mutation.
- **Zustand** owns only UI state (modal open/mode/item, deleteTarget, selectedIds). All server data lives in TanStack Query.
- `GET /api/inventory/stats` is declared **before** `GET /api/inventory/{id}` in the controller to avoid Spring path-variable collision.

## Environment Variables

| Variable | Default | Notes |
|----------|---------|-------|
| `VITE_API_BASE_URL` | `/api` | Proxied by Vite dev server and nginx in prod |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/apexdb` | Override for Docker: `jdbc:postgresql://db:5432/apexdb` |
| `SPRING_DATASOURCE_USERNAME` | `apex` | |
| `SPRING_DATASOURCE_PASSWORD` | `apex` | |

Copy `.env.example` to `.env` before running with Docker Compose.
