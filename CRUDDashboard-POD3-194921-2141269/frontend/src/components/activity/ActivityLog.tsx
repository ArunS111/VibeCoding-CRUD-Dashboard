import { Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import type { ActivityLogEntry } from '../../types/inventory';

interface ActivityLogProps {
  logs: ActivityLogEntry[];
}

const actionIcon = {
  created: <Plus size={14} className="text-green-600" />,
  updated: <Pencil size={14} className="text-blue-600" />,
  deleted: <Trash2 size={14} className="text-red-600" />,
};

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
        <Clock size={15} /> Recent Activity
      </h3>
      {logs.length === 0 ? (
        <p className="text-xs text-gray-400">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log.id} className="flex items-center gap-2 text-xs text-gray-600">
              {actionIcon[log.action as keyof typeof actionIcon] ?? null}
              <span>
                Item <span className="font-medium text-gray-800">"{log.itemName}"</span>{' '}
                {log.action}
              </span>
              <span className="ml-auto text-gray-400 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
