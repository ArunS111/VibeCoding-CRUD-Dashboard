# generate-crud-tests

Generate a complete CRUD test suite for a given entity in the Project Apex codebase.

## Usage
```
/generate-crud-tests <EntityName>
```

Example: `/generate-crud-tests InventoryItem`

## What this skill does

Given an entity name, this skill will:

1. **Read** the entity's model, DTO, repository, service, and controller files from the backend
2. **Read** the corresponding frontend types, API service, and hook files
3. **Generate** the following test files:

### Backend tests (JUnit 5 + Mockito)
- `backend/src/test/java/com/apex/inventory/service/<Entity>ServiceTest.java`
  - Unit tests for every public service method using Mockito mocks
  - Happy path + edge cases (not found, duplicate SKU, validation failure)
  - Tests for any derived/computed fields (e.g. stockStatus from quantity)

### Frontend tests (Vitest + React Testing Library)
- `frontend/src/components/**/<Entity>*.test.tsx`
  - Row/card render tests with all stock status variants (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
  - Modal open/close, form submission, validation error display
  - Hook mutation mocking with `vi.mock`

## Rules for generation
- Backend: use `@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`
- Frontend: use `renderWithProviders` wrapper that includes `QueryClientProvider`
- Cover all 3 `deriveStockStatus` branches in backend service tests
- Test both create and edit modes for any modal component
- Assert on ARIA roles and accessible text, not raw DOM structure
- Do NOT add `@SpringBootTest` (unit tests only — no container spin-up)

## Arguments
- `$ARGUMENTS` — the PascalCase entity name (e.g. `InventoryItem`)

## Steps
1. Read `backend/src/main/java/com/apex/inventory/model/$ARGUMENTS.java`
2. Read `backend/src/main/java/com/apex/inventory/service/$ARGUMENTS` + `Service.java`
3. Read `backend/src/main/java/com/apex/inventory/controller/$ARGUMENTS` + `Controller.java`
4. Read `frontend/src/types/inventory.ts`
5. Read relevant frontend component files
6. Generate and write all test files
7. Report: list of files written + test case count
