import { Badge } from '../ui/Badge';
import type { StockStatus } from '../../types/inventory';

export function StockBadge({ status }: { status: StockStatus }) {
  if (status === 'IN_STOCK')    return <Badge label="In Stock"    color="green" />;
  if (status === 'LOW_STOCK')   return <Badge label="Low Stock"   color="yellow" />;
  return                               <Badge label="Out of Stock" color="red" />;
}
