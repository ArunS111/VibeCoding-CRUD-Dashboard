#!/usr/bin/env node
/**
 * Project Apex — Inventory MCP Server
 *
 * Exposes the running Spring Boot backend (localhost:8080) as Claude tools so
 * Claude can query live inventory data, stats, and activity logs directly inside
 * any Claude Code session without copy-pasting API responses.
 *
 * Tools provided:
 *   list_inventory   — list/search/filter items
 *   get_stats        — dashboard KPIs (total, low-stock, out-of-stock)
 *   get_item         — fetch a single item by ID
 *   get_activity_log — recent create/update/delete events
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE_URL = process.env.APEX_API_URL ?? 'http://localhost:8080/api';

async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

const server = new McpServer({
  name: 'apex-inventory',
  version: '1.0.0',
});

// ── Tool: list_inventory ───────────────────────────────────────────────────────
server.tool(
  'list_inventory',
  'List inventory items. Optionally filter by search term, category, and sort order.',
  {
    search:   z.string().optional().describe('Search term matched against name, SKU, category'),
    category: z.string().optional().describe('Exact category filter, e.g. "Electronics"'),
    sortBy:   z.enum(['name', 'sku', 'category', 'price', 'quantity']).optional().default('name'),
    sortDir:  z.enum(['asc', 'desc']).optional().default('asc'),
  },
  async ({ search, category, sortBy, sortDir }) => {
    const qs = new URLSearchParams();
    if (search)   qs.set('search', search);
    if (category) qs.set('category', category);
    if (sortBy)   qs.set('sortBy', sortBy);
    if (sortDir)  qs.set('sortDir', sortDir);
    const items = await apiFetch(`/inventory?${qs}`);
    if (items.length === 0) return { content: [{ type: 'text', text: 'No items found.' }] };
    const rows = items.map((i) =>
      `[${i.id}] ${i.name} | SKU: ${i.sku} | ${i.category} | $${i.price} | qty: ${i.quantity} | ${i.stockStatus}`
    );
    return {
      content: [{
        type: 'text',
        text: `Found ${items.length} item(s):\n\n${rows.join('\n')}`,
      }],
    };
  }
);

// ── Tool: get_stats ────────────────────────────────────────────────────────────
server.tool(
  'get_stats',
  'Get dashboard KPI stats: total items, low-stock count, out-of-stock count.',
  {},
  async () => {
    const s = await apiFetch('/inventory/stats');
    return {
      content: [{
        type: 'text',
        text: [
          `Total items:     ${s.totalItems}`,
          `Low stock:       ${s.lowStockItems}`,
          `Out of stock:    ${s.outOfStockItems}`,
          `In stock:        ${s.totalItems - s.lowStockItems - s.outOfStockItems}`,
        ].join('\n'),
      }],
    };
  }
);

// ── Tool: get_item ─────────────────────────────────────────────────────────────
server.tool(
  'get_item',
  'Fetch a single inventory item by its numeric ID.',
  { id: z.number().int().positive().describe('Item ID') },
  async ({ id }) => {
    const i = await apiFetch(`/inventory/${id}`);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(i, null, 2),
      }],
    };
  }
);

// ── Tool: get_activity_log ────────────────────────────────────────────────────
server.tool(
  'get_activity_log',
  'Fetch the most recent inventory activity events (creates, updates, deletes).',
  { limit: z.number().int().min(1).max(50).optional().default(10).describe('Max events to return') },
  async ({ limit }) => {
    const logs = await apiFetch(`/activity-log?limit=${limit}`);
    if (logs.length === 0) return { content: [{ type: 'text', text: 'No activity yet.' }] };
    const rows = logs.map((l) => `[${l.timestamp}] ${l.action.toUpperCase()} — ${l.itemName}`);
    return {
      content: [{
        type: 'text',
        text: rows.join('\n'),
      }],
    };
  }
);

// ── Start ──────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
