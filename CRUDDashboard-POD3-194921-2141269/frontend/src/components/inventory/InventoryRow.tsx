import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { StockBadge } from './StockBadge';
import type { InventoryItem } from '../../types/inventory';

interface InventoryRowProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  selected?: boolean;
  onSelect?: () => void;
}

const rowBg = {
  IN_STOCK:    'bg-white hover:bg-gray-50',
  LOW_STOCK:   'bg-yellow-50 hover:bg-yellow-100',
  OUT_OF_STOCK:'bg-red-50 hover:bg-red-100',
};

export function InventoryRow({ item, onEdit, onDelete, selected, onSelect }: InventoryRowProps) {
  return (
    <tr className={`transition-colors ${rowBg[item.stockStatus]}`}>
      <td className="px-4 py-3 text-center">
        <input
          type="checkbox"
          checked={selected ?? false}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{item.sku}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
      <td className="px-4 py-3 text-sm text-gray-900">${Number(item.price).toFixed(2)}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
      <td className="px-4 py-3"><StockBadge status={item.stockStatus} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Pencil size={14} /> Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
