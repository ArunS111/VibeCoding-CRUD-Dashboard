import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Header } from './components/layout/Header';
import { StatsBar } from './components/dashboard/StatsBar';
import { SearchBar } from './components/dashboard/SearchBar';
import { CategoryChart } from './components/dashboard/CategoryChart';
import { InventoryTable } from './components/inventory/InventoryTable';
import { BulkDeleteBar } from './components/inventory/BulkDeleteBar';
import { ItemModal } from './components/modals/ItemModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { ActivityLog } from './components/activity/ActivityLog';
import { Button } from './components/ui/Button';
import { useInventoryStore } from './store/inventoryStore';
import {
  useInventory, useStats, useActivityLog,
  useCreateItem, useUpdateItem, useDeleteItem, useBulkDelete,
} from './hooks/useInventory';
import type { ItemFormData } from './types/inventory';

export default function App() {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: 'asc' | 'desc' }>({
    key: 'name',
    dir: 'asc',
  });

  const store = useInventoryStore();

  const { data: allItems = [], isLoading } = useInventory();
  const { data: stats } = useStats();
  const { data: activityLogs = [] } = useActivityLog();

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const bulkDelete = useBulkDelete();

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    return allItems
      .filter((i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const key = sortConfig.key as keyof typeof a;
        const av = a[key] ?? '';
        const bv = b[key] ?? '';
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortConfig.dir === 'asc' ? cmp : -cmp;
      });
  }, [allItems, search, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((c) => ({
      key,
      dir: c.key === key && c.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSave = async (data: ItemFormData) => {
    if (store.modalMode === 'create') {
      await createItem.mutateAsync(data);
    } else if (store.editingItem) {
      await updateItem.mutateAsync({ id: store.editingItem.id, data });
    }
    store.closeModal();
  };

  const handleConfirmDelete = async () => {
    if (store.deleteTarget) {
      await deleteItem.mutateAsync(store.deleteTarget.id);
      store.closeDeleteConfirm();
    }
  };

  const handleBulkDelete = async () => {
    await bulkDelete.mutateAsync([...store.selectedIds]);
    store.clearSelection();
  };

  const handleSelectAll = () => {
    if (filteredItems.every((i) => store.selectedIds.has(i.id))) {
      store.clearSelection();
    } else {
      store.selectAll(filteredItems.map((i) => i.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <StatsBar
          totalItems={stats?.totalItems ?? 0}
          lowStockItems={stats?.lowStockItems ?? 0}
          outOfStockItems={stats?.outOfStockItems ?? 0}
        />

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <Button onClick={store.openCreateModal}>
            <Plus size={16} /> Add Item
          </Button>
        </div>

        {/* Bulk delete bar */}
        <BulkDeleteBar
          selectedCount={store.selectedIds.size}
          onBulkDelete={handleBulkDelete}
          onClearSelection={store.clearSelection}
        />

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading inventory...</div>
        ) : (
          <InventoryTable
            items={filteredItems}
            onEdit={store.openEditModal}
            onDelete={store.openDeleteConfirm}
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedIds={store.selectedIds}
            onSelectRow={store.toggleSelection}
            onSelectAll={handleSelectAll}
          />
        )}

        {/* Stretch goals row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CategoryChart items={allItems} />
          <ActivityLog logs={activityLogs} />
        </div>
      </main>

      {/* Modals */}
      {store.modalOpen && (
        <ItemModal
          mode={store.modalMode}
          item={store.editingItem}
          onSave={handleSave}
          onClose={store.closeModal}
          isLoading={createItem.isPending || updateItem.isPending}
        />
      )}

      {store.deleteTarget && (
        <DeleteConfirmModal
          itemName={store.deleteTarget.name}
          onConfirm={handleConfirmDelete}
          onCancel={store.closeDeleteConfirm}
        />
      )}
    </div>
  );
}
