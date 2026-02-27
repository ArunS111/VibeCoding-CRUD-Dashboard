# audit-inventory-schema

Audit the Project Apex data model and API surface for consistency, missing validations,
and schema drift between backend and frontend.

## Usage
```
/audit-inventory-schema
```

No arguments required.

## What this skill does

Reads all critical files and produces a structured report covering:

### 1. DTO ↔ Frontend Type Alignment
- Compare every field in `InventoryItemDTO.java` against `InventoryItem` in `inventory.ts`
- Flag missing fields, type mismatches, or naming discrepancies (camelCase vs snake_case)

### 2. Validation Coverage
- Check `CreateItemRequest` and `UpdateItemRequest` for `@NotBlank`, `@NotNull`, `@Min`, `@Size`
- Confirm matching client-side validation in `ItemModal.tsx`
- Flag any field that is validated on one side but not the other

### 3. API Route Completeness
- Compare routes in `InventoryController.java` against calls in `api.ts`
- Flag any backend endpoint with no frontend caller, or frontend call with no matching endpoint

### 4. StockStatus Consistency
- Confirm `StockStatus` enum values match `StockStatus` type in `inventory.ts`
- Confirm `deriveStockStatus` thresholds align with frontend row-highlight logic in `InventoryRow.tsx`

### 5. Missing Error Handling
- Check that every `mutateAsync` call in `App.tsx` is wrapped in try/catch
- Check that `GlobalExceptionHandler` covers all custom exceptions thrown in services

## Output format

```
## Audit Report — Project Apex Inventory Schema
Generated: <timestamp>

### ✅ Passing
- ...

### ⚠ Warnings
- ...

### ❌ Issues
- ...

### Recommendations
- ...
```

## Files read
- `backend/src/main/java/com/apex/inventory/model/InventoryItem.java`
- `backend/src/main/java/com/apex/inventory/model/StockStatus.java`
- `backend/src/main/java/com/apex/inventory/dto/InventoryItemDTO.java`
- `backend/src/main/java/com/apex/inventory/dto/CreateItemRequest.java`
- `backend/src/main/java/com/apex/inventory/dto/UpdateItemRequest.java`
- `backend/src/main/java/com/apex/inventory/controller/InventoryController.java`
- `backend/src/main/java/com/apex/inventory/exception/GlobalExceptionHandler.java`
- `frontend/src/types/inventory.ts`
- `frontend/src/services/api.ts`
- `frontend/src/components/modals/ItemModal.tsx`
- `frontend/src/components/inventory/InventoryRow.tsx`
- `frontend/src/App.tsx`
