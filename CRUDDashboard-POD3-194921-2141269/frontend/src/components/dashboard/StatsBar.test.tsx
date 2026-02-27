import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsBar } from '../dashboard/StatsBar';

describe('StatsBar', () => {
  it('renders all three KPI values', () => {
    render(<StatsBar totalItems={42} lowStockItems={7} outOfStockItems={2} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders all three labels', () => {
    render(<StatsBar totalItems={0} lowStockItems={0} outOfStockItems={0} />);
    expect(screen.getByText('Total Unique Items')).toBeInTheDocument();
    expect(screen.getByText('Low on Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
