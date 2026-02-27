import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InventoryRow } from '../inventory/InventoryRow';
import type { InventoryItem } from '../../types/inventory';

const base: InventoryItem = {
  id: 1, name: 'T-Shirt', sku: 'TS-001', category: 'Apparel',
  price: 19.99, quantity: 50, stockStatus: 'IN_STOCK',
  imageUrl: null, createdAt: '', updatedAt: '',
};

describe('InventoryRow', () => {
  it('renders item data', () => {
    render(<table><tbody><InventoryRow item={base} onEdit={vi.fn()} onDelete={vi.fn()} /></tbody></table>);
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('TS-001')).toBeInTheDocument();
  });

  it('applies yellow bg for LOW_STOCK', () => {
    const item = { ...base, quantity: 5, stockStatus: 'LOW_STOCK' as const };
    const { container } = render(
      <table><tbody><InventoryRow item={item} onEdit={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(container.querySelector('tr')).toHaveClass('bg-yellow-50');
  });

  it('applies red bg for OUT_OF_STOCK', () => {
    const item = { ...base, quantity: 0, stockStatus: 'OUT_OF_STOCK' as const };
    const { container } = render(
      <table><tbody><InventoryRow item={item} onEdit={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(container.querySelector('tr')).toHaveClass('bg-red-50');
  });

  it('calls onEdit when Edit clicked', async () => {
    const onEdit = vi.fn();
    render(<table><tbody><InventoryRow item={base} onEdit={onEdit} onDelete={vi.fn()} /></tbody></table>);
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(base);
  });

  it('calls onDelete when Delete clicked', async () => {
    const onDelete = vi.fn();
    render(<table><tbody><InventoryRow item={base} onEdit={vi.fn()} onDelete={onDelete} /></tbody></table>);
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(base);
  });
});
