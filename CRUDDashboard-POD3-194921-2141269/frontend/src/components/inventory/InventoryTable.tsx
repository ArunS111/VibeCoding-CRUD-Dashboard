import { ColumnHeader } from './ColumnHeader';
import { InventoryRow } from './InventoryRow';
import type { InventoryItem } from '../../types/inventory';

interface SortConfig { key: string; dir: 'asc' | 'desc'; }

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  selectedIds: Set<number>;
  onSelectRow: (id: number) => void;
  onSelectAll: () => void;
}

export function InventoryTable({
  items, onEdit, onDelete, sortConfig, onSort, selectedIds, onSelectRow, onSelectAll,
}: InventoryTableProps) {
  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm mt-1">Add your first inventory item or clear the search filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-center w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <ColumnHeader label="Name"     sortKey="name"     sortConfig={sortConfig} onSort={onSort} />
            <ColumnHeader label="SKU"      sortKey="sku"      sortConfig={sortConfig} onSort={onSort} />
            <ColumnHeader label="Category" sortKey="category" sortConfig={sortConfig} onSort={onSort} />
            <ColumnHeader label="Price"    sortKey="price"    sortConfig={sortConfig} onSort={onSort} />
            <ColumnHeader label="Quantity" sortKey="quantity" sortConfig={sortConfig} onSort={onSort} />
            <ColumnHeader label="Status"   sortConfig={sortConfig} onSort={onSort} />
            <ColumnHeader label="Actions"  sortConfig={sortConfig} onSort={onSort} />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <InventoryRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              selected={selectedIds.has(item.id)}
              onSelect={() => onSelectRow(item.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
