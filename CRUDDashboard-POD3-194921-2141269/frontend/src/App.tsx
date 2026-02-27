import { useState, useMemo, useRef } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Header } from './components/layout/Header';
import { StatsBar } from './components/dashboard/StatsBar';
import { SearchBar } from './components/dashboard/SearchBar';
import { CategoryChart } from './components/dashboard/CategoryChart';
import { StockPieChart } from './components/dashboard/StockPieChart';
import { InventoryTable } from './components/inventory/InventoryTable';
import { BulkDeleteBar } from './components/inventory/BulkDeleteBar';
import { ItemModal } from './components/modals/ItemModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { ActivityLog } from './components/activity/ActivityLog';
import { Button } from './components/ui/Button';
import ToastContainer from './components/ui/ToastContainer';
import { useInventoryStore } from './store/inventoryStore';
import { useToastStore } from './store/toastStore';
import {
  useInventory, useStats, useActivityLog,
  useCreateItem, useUpdateItem, useDeleteItem, useBulkDelete, useImportCsv,
} from './hooks/useInventory';
import { inventoryApi } from './services/api';
import type { ItemFormData, InventoryItem } from './types/inventory';

function stockAlertMessage(item: InventoryItem): string | null {
  if (item.stockStatus === 'OUT_OF_STOCK') return `"${item.name}" is now OUT OF STOCK`;
  if (item.stockStatus === 'LOW_STOCK')    return `"${item.name}" is LOW STOCK (${item.quantity} remaining)`;
  return null;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: 'asc' | 'desc' }>({
    key: 'name',
    dir: 'asc',
  });

  const store = useInventoryStore();
  const toast = useToastStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: allItems = [], isLoading } = useInventory();
  const { data: stats } = useStats();
  const { data: activityLogs = [] } = useActivityLog();

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const bulkDelete = useBulkDelete();
  const importCsv = useImportCsv();

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
    try {
      if (store.modalMode === 'create') {
        const created = await createItem.mutateAsync(data);
        toast.push(`"${created.name}" added to inventory`, 'success');
        const alert = stockAlertMessage(created);
        if (alert) toast.push(alert, created.stockStatus === 'OUT_OF_STOCK' ? 'error' : 'warning');
      } else if (store.editingItem) {
        const updated = await updateItem.mutateAsync({ id: store.editingItem.id, data });
        toast.push(`"${updated.name}" updated`, 'success');
        const alert = stockAlertMessage(updated);
        if (alert) toast.push(alert, updated.stockStatus === 'OUT_OF_STOCK' ? 'error' : 'warning');
      }
      store.closeModal();
    } catch {
      toast.push('Failed to save item. Check for duplicate SKU.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (store.deleteTarget) {
      try {
        await deleteItem.mutateAsync(store.deleteTarget.id);
        toast.push(`"${store.deleteTarget.name}" deleted`, 'info');
        store.closeDeleteConfirm();
      } catch {
        toast.push('Failed to delete item.', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    const count = store.selectedIds.size;
    try {
      await bulkDelete.mutateAsync([...store.selectedIds]);
      toast.push(`${count} item${count > 1 ? 's' : ''} deleted`, 'info');
      store.clearSelection();
    } catch {
      toast.push('Bulk delete failed.', 'error');
    }
  };

  const handleSelectAll = () => {
    if (filteredItems.every((i) => store.selectedIds.has(i.id))) {
      store.clearSelection();
    } else {
      store.selectAll(filteredItems.map((i) => i.id));
    }
  };

  const handleExport = () => {
    inventoryApi.exportCsv({ search: search || undefined });
    toast.push('CSV export started', 'success');
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const result = await importCsv.mutateAsync(file);
      toast.push(`Imported ${result.imported} item${result.imported !== 1 ? 's' : ''}${result.skipped ? `, ${result.skipped} skipped` : ''}`, result.skipped > 0 ? 'warning' : 'success');
    } catch {
      toast.push('Import failed — check file format.', 'error');
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
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
            <Button variant="ghost" onClick={handleImportClick} disabled={importCsv.isPending}>
              <Upload size={16} /> {importCsv.isPending ? 'Importing…' : 'Import CSV'}
            </Button>
            <Button variant="ghost" onClick={handleExport}>
              <Download size={16} /> Export CSV
            </Button>
            <Button onClick={store.openCreateModal}>
              <Plus size={16} /> Add Item
            </Button>
          </div>
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

        {/* Charts + Activity row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CategoryChart items={allItems} />
          <StockPieChart items={allItems} />
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

      <ToastContainer />
    </div>
  );
}
