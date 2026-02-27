# prompts.md — Claude Code Automation Guide

This document describes the MCP plugin, automation hooks, and reusable skills configured
for Project Apex. All three extend Claude Code's capabilities beyond single-session chat.

---

## 1. MCP Plugin — Inventory API (`apex-inventory`)

**File:** `mcp-server/index.js`
**Registration:** `.claude/settings.json` → `mcpServers.apex-inventory`

### What it does
Connects Claude Code directly to the running Spring Boot backend at `http://localhost:8080/api`.
Instead of manually calling `curl` or pasting API responses, Claude can call these tools inline:

| Tool              | Description |
|-------------------|-------------|
| `list_inventory`  | List/search items with optional `search`, `category`, `sortBy`, `sortDir` |
| `get_stats`       | Fetch dashboard KPIs: total, lowStock, outOfStock |
| `get_item`        | Fetch one item by ID |
| `get_activity_log`| Fetch the N most recent activity events |

### Why this plugin
During development, a common need is "show me what's actually in the database right now"
without switching to the browser or Postman. The MCP plugin lets Claude answer questions
like "which items are out of stock?" or "what was the last 5 activity log entries?" in real
time — useful for debugging seeded data, verifying imports, or validating business logic.

### Setup
```bash
cd mcp-server && npm install
```

The backend must be running (`mvn spring-boot:run`) before MCP tools will return data.

Override the API URL if running on a different port:
```json
{ "env": { "APEX_API_URL": "http://localhost:9090/api" } }
```

### Example prompts
- "Use `get_stats` to check current stock health"
- "List all items in the Electronics category sorted by quantity ascending"
- "Show the last 20 activity log entries"

---

## 2. Automation Hooks

**File:** `.claude/settings.json` → `hooks.PostToolUse`

Two hooks fire automatically after every `Edit` or `Write` tool call:

### Hook A — ESLint Auto-fix
**Trigger:** Any `.ts` or `.tsx` file inside `frontend/src/` is edited
**Action:** Runs `npx eslint --fix --quiet` on the modified file

```json
{
  "matcher": "Edit|Write",
  "hooks": [{ "type": "command", "command": "node -e \"...eslint fix...\"" }]
}
```

**Why:** Keeps frontend code lint-clean after every Claude edit without a separate lint step.
Catches unused imports, missing semicolons, and React hook ordering violations immediately.

### Hook B — CHANGELOG Auto-log
**Trigger:** Any file is edited or written
**Action:** Appends a timestamped entry to `CHANGELOG.md`

```
2026-02-27T14:23:00.000Z | MODIFIED | frontend/src/App.tsx
2026-02-27T14:23:01.000Z | MODIFIED | backend/src/main/.../InventoryService.java
```

**Why:** Provides a persistent audit trail of every file Claude touched across sessions.
Useful for code review, rollback decisions, and understanding the scope of a refactor.
`CHANGELOG.md` is gitignored during development (add to `.gitignore` if preferred) but
can be committed as a change diary for the project.

---

## 3. Skills (Slash Commands)

Skills are stored in `.claude/commands/` and invoked with `/skill-name` in any session.

### Skill A — `/generate-crud-tests <EntityName>`

**File:** `.claude/commands/generate-crud-tests.md`

**What it does:**
Reads the full backend+frontend stack for a named entity and generates:
- JUnit 5 + Mockito service unit tests (all public methods, all branches)
- Vitest + React Testing Library component tests (render, modal, stock status variants)

**Why:** Writing CRUD tests is repetitive and high-effort. This skill encodes the project's
testing conventions (MockitoExtension, renderWithProviders, ARIA assertions) so every new
entity gets a consistent test suite in seconds instead of hours.

**Usage:**
```
/generate-crud-tests InventoryItem
/generate-crud-tests ActivityLog
```

---

### Skill B — `/audit-inventory-schema`

**File:** `.claude/commands/audit-inventory-schema.md`

**What it does:**
Reads 12 key files across backend and frontend and produces a structured report on:
1. DTO ↔ TypeScript type alignment (field names, types, missing fields)
2. Validation coverage (backend `@NotBlank` vs frontend form validation)
3. API route completeness (every endpoint has a caller; every caller has an endpoint)
4. `StockStatus` consistency (enum values, derive thresholds, row highlight logic)
5. Missing error handling (`try/catch` on mutations, `GlobalExceptionHandler` coverage)

**Why:** As the app evolves, backend DTOs and frontend types drift silently. This skill
catches drift before it reaches production — acting as a lightweight contract test that
runs in seconds with no test infrastructure required.

**Usage:**
```
/audit-inventory-schema
```

---

## Quick Reference

| Feature              | File                                   | Invoke |
|----------------------|----------------------------------------|--------|
| MCP: live API data   | `mcp-server/index.js`                  | Auto (Claude tools) |
| Hook: ESLint fix     | `.claude/settings.json`                | Auto (on file edit) |
| Hook: CHANGELOG log  | `.claude/settings.json`                | Auto (on file edit) |
| Skill: CRUD tests    | `.claude/commands/generate-crud-tests.md` | `/generate-crud-tests <Entity>` |
| Skill: schema audit  | `.claude/commands/audit-inventory-schema.md` | `/audit-inventory-schema` |
