import { create } from 'zustand';
import type { InventoryItem } from '../types/inventory';

export type ModalMode = 'create' | 'edit';

interface InventoryStore {
  // Modal state
  modalOpen: boolean;
  modalMode: ModalMode;
  editingItem: InventoryItem | null;
  openCreateModal: () => void;
  openEditModal: (item: InventoryItem) => void;
  closeModal: () => void;

  // Delete confirmation
  deleteTarget: InventoryItem | null;
  openDeleteConfirm: (item: InventoryItem) => void;
  closeDeleteConfirm: () => void;

  // Selection (bulk delete)
  selectedIds: Set<number>;
  toggleSelection: (id: number) => void;
  selectAll: (ids: number[]) => void;
  clearSelection: () => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  modalOpen: false,
  modalMode: 'create',
  editingItem: null,
  openCreateModal: () => set({ modalOpen: true, modalMode: 'create', editingItem: null }),
  openEditModal: (item) => set({ modalOpen: true, modalMode: 'edit', editingItem: item }),
  closeModal: () => set({ modalOpen: false, editingItem: null }),

  deleteTarget: null,
  openDeleteConfirm: (item) => set({ deleteTarget: item }),
  closeDeleteConfirm: () => set({ deleteTarget: null }),

  selectedIds: new Set(),
  toggleSelection: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
}));
