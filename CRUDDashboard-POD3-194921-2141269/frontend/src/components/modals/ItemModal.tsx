import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { InventoryItem, ItemFormData } from '../../types/inventory';

interface ItemModalProps {
  mode: 'create' | 'edit';
  item: InventoryItem | null;
  onSave: (data: ItemFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const empty: ItemFormData = { name: '', sku: '', category: '', price: 0, quantity: 0, imageUrl: '' };

export function ItemModal({ mode, item, onSave, onClose, isLoading }: ItemModalProps) {
  const [form, setForm] = useState<ItemFormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({});

  useEffect(() => {
    if (mode === 'edit' && item) {
      setForm({
        name: item.name,
        sku: item.sku,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || '',
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [mode, item]);

  const set = (field: keyof ItemFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim())     e.name = 'Name is required';
    if (!form.sku.trim())      e.sku = 'SKU is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (Number(form.price) < 0) e.price = 'Price must be 0 or greater';
    if (Number(form.quantity) < 0) e.quantity = 'Quantity must be 0 or greater';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
  };

  return (
    <Modal title={mode === 'create' ? 'Add New Item' : 'Edit Item'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name"     value={form.name}     onChange={set('name')}     error={errors.name}     placeholder="e.g. T-Shirt" />
          <Input label="SKU"      value={form.sku}      onChange={set('sku')}      error={errors.sku}      placeholder="e.g. TS-001" />
          <Input label="Category" value={form.category} onChange={set('category')} error={errors.category} placeholder="e.g. Apparel" />
          <Input label="Price"    value={form.price}    onChange={set('price')}    error={errors.price}    type="number" min="0" step="0.01" />
          <Input label="Quantity" value={form.quantity} onChange={set('quantity')} error={errors.quantity} type="number" min="0" />
          <Input label="Image URL (optional)" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Item' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
