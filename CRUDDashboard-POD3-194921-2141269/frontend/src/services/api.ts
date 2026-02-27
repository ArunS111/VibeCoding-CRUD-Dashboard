import axios from 'axios';
import type { InventoryItem, DashboardStats, ActivityLogEntry, ItemFormData, ImportResult } from '../types/inventory';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export interface InventoryQuery {
  search?: string;
  category?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const inventoryApi = {
  getAll: (params: InventoryQuery = {}) =>
    api.get<InventoryItem[]>('/inventory', { params }).then((r) => r.data),

  getStats: () =>
    api.get<DashboardStats>('/inventory/stats').then((r) => r.data),

  create: (data: ItemFormData) =>
    api.post<InventoryItem>('/inventory', data).then((r) => r.data),

  update: (id: number, data: ItemFormData) =>
    api.put<InventoryItem>(`/inventory/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/inventory/${id}`),

  bulkDelete: (ids: number[]) =>
    api.delete('/inventory/bulk', { data: { ids } }),

  getActivityLog: (limit = 10) =>
    api.get<ActivityLogEntry[]>('/activity-log', { params: { limit } }).then((r) => r.data),

  exportCsv: (params: Pick<InventoryQuery, 'search' | 'category'> = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    const qs = query.toString();
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
    const url = `${baseURL}/inventory/export/csv${qs ? '?' + qs : ''}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
  },

  importCsv: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<ImportResult>('/inventory/import/csv', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
};
