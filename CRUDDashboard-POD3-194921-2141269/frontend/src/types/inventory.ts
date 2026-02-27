export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  stockStatus: StockStatus;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export interface ActivityLogEntry {
  id: number;
  action: string;
  itemName: string;
  timestamp: string;
}

export interface ItemFormData {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
