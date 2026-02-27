import { Package, AlertTriangle, XCircle } from 'lucide-react';
import { StatCard } from './StatCard';

interface StatsBarProps {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export function StatsBar({ totalItems, lowStockItems, outOfStockItems }: StatsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Unique Items"
        value={totalItems}
        variant="default"
        icon={<Package size={22} />}
      />
      <StatCard
        label="Low on Stock"
        value={lowStockItems}
        variant="warning"
        icon={<AlertTriangle size={22} />}
      />
      <StatCard
        label="Out of Stock"
        value={outOfStockItems}
        variant="danger"
        icon={<XCircle size={22} />}
      />
    </div>
  );
}
