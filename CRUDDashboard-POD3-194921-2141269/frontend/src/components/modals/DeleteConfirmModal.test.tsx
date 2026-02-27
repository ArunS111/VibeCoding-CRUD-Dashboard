import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  it('shows item name in message', () => {
    render(<DeleteConfirmModal itemName="T-Shirt" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/"T-Shirt"/)).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it('calls onConfirm when Yes, Delete clicked', async () => {
    const onConfirm = vi.fn();
    render(<DeleteConfirmModal itemName="T-Shirt" onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /yes, delete/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when Cancel clicked', async () => {
    const onCancel = vi.fn();
    render(<DeleteConfirmModal itemName="T-Shirt" onConfirm={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
