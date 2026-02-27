import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteConfirmModalProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ itemName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <p className="text-center text-gray-700">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">"{itemName}"</span>?
          <br />
          <span className="text-sm text-gray-500">This action cannot be undone.</span>
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>Yes, Delete</Button>
        </div>
      </div>
    </Modal>
  );
}
