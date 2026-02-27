import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { InventoryItem } from '../../types/inventory';

interface StockPieChartProps {
  items: InventoryItem[];
}

const SLICES = [
  { key: 'IN_STOCK',    label: 'In Stock',    color: '#22c55e' },
  { key: 'LOW_STOCK',   label: 'Low Stock',   color: '#f59e0b' },
  { key: 'OUT_OF_STOCK',label: 'Out of Stock', color: '#ef4444' },
] as const;

export function StockPieChart({ items }: StockPieChartProps) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.stockStatus] = (acc[item.stockStatus] ?? 0) + 1;
    return acc;
  }, {});

  const data = SLICES
    .map((s) => ({ name: s.label, value: counts[s.key] ?? 0, color: s.color }))
    .filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Stock Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={75}
            innerRadius={40}
            paddingAngle={3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} item${value !== 1 ? 's' : ''}`, '']} />
          <Legend iconType="circle" iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
