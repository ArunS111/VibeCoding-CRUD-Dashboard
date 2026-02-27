import { Package } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Package size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Project Apex</h1>
          <p className="text-xs text-gray-500">Intelligent Inventory Hub</p>
        </div>
      </div>
    </header>
  );
}
