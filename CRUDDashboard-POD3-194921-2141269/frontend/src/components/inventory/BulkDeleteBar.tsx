import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface BulkDeleteBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function BulkDeleteBar({ selectedCount, onBulkDelete, onClearSelection }: BulkDeleteBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
      <span className="text-sm font-medium text-blue-800">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onClearSelection}>Clear</Button>
        <Button variant="danger" size="sm" onClick={onBulkDelete}>
          <Trash2 size={14} /> Delete Selected
        </Button>
      </div>
    </div>
  );
}
