package com.apex.inventory.dto;

public class DashboardStatsDTO {
    private long totalItems;
    private long lowStockItems;
    private long outOfStockItems;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalItems, long lowStockItems, long outOfStockItems) {
        this.totalItems = totalItems; this.lowStockItems = lowStockItems; this.outOfStockItems = outOfStockItems;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalItems, lowStockItems, outOfStockItems;
        public Builder totalItems(long v)      { this.totalItems = v; return this; }
        public Builder lowStockItems(long v)   { this.lowStockItems = v; return this; }
        public Builder outOfStockItems(long v) { this.outOfStockItems = v; return this; }
        public DashboardStatsDTO build() { return new DashboardStatsDTO(totalItems, lowStockItems, outOfStockItems); }
    }

    public long getTotalItems()              { return totalItems; }
    public void setTotalItems(long v)        { this.totalItems = v; }
    public long getLowStockItems()           { return lowStockItems; }
    public void setLowStockItems(long v)     { this.lowStockItems = v; }
    public long getOutOfStockItems()         { return outOfStockItems; }
    public void setOutOfStockItems(long v)   { this.outOfStockItems = v; }
}
