import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, type InventoryQuery } from '../services/api';
import type { ItemFormData } from '../types/inventory';

export const INVENTORY_KEY = ['inventory'] as const;
export const STATS_KEY = ['stats'] as const;
export const ACTIVITY_KEY = ['activity-log'] as const;

export function useInventory(query: InventoryQuery = {}) {
  return useQuery({
    queryKey: [...INVENTORY_KEY, query],
    queryFn: () => inventoryApi.getAll(query),
  });
}

export function useStats() {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: inventoryApi.getStats,
  });
}

export function useActivityLog(limit = 10) {
  return useQuery({
    queryKey: [...ACTIVITY_KEY, limit],
    queryFn: () => inventoryApi.getActivityLog(limit),
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemFormData) => inventoryApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
      qc.invalidateQueries({ queryKey: ACTIVITY_KEY });
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemFormData }) =>
      inventoryApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
      qc.invalidateQueries({ queryKey: ACTIVITY_KEY });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => inventoryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
      qc.invalidateQueries({ queryKey: ACTIVITY_KEY });
    },
  });
}

export function useBulkDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => inventoryApi.bulkDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
      qc.invalidateQueries({ queryKey: ACTIVITY_KEY });
    },
  });
}
