import React from 'react';

type Variant = 'default' | 'warning' | 'danger';

interface StatCardProps {
  label: string;
  value: number;
  variant?: Variant;
  icon: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-blue-50 text-blue-600',
  warning: 'bg-yellow-50 text-yellow-600',
  danger:  'bg-red-50 text-red-600',
};

const valueClasses: Record<Variant, string> = {
  default: 'text-gray-900',
  warning: 'text-yellow-700',
  danger:  'text-red-700',
};

export function StatCard({ label, value, variant = 'default', icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${valueClasses[variant]}`}>{value}</p>
      </div>
    </div>
  );
}
