import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface SortConfig {
  key: string;
  dir: 'asc' | 'desc';
}

interface ColumnHeaderProps {
  label: string;
  sortKey?: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export function ColumnHeader({ label, sortKey, sortConfig, onSort }: ColumnHeaderProps) {
  if (!sortKey) {
    return <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</th>;
  }

  const isActive = sortConfig.key === sortKey;
  const Icon = isActive ? (sortConfig.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      <button
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 hover:text-gray-900 transition-colors
          ${isActive ? 'text-blue-600' : ''}`}
      >
        {label}
        <Icon size={13} />
      </button>
    </th>
  );
}
