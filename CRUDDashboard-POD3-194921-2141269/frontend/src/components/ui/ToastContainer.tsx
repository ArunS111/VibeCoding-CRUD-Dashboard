import { X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import type { ToastSeverity } from '../../types/inventory';

const styles: Record<ToastSeverity, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  error:   'bg-red-50   border-red-400   text-red-800',
  info:    'bg-blue-50  border-blue-400  text-blue-800',
};

const icons: Record<ToastSeverity, string> = {
  success: '✓',
  warning: '⚠',
  error:   '✕',
  info:    'ℹ',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-3 rounded-lg border shadow-md text-sm ${styles[t.severity]}`}
        >
          <span className="font-bold text-base leading-none mt-0.5">{icons[t.severity]}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
