package com.apex.inventory.dto;

import java.time.LocalDateTime;

public class ActivityLogDTO {
    private Long id;
    private String action, itemName;
    private LocalDateTime timestamp;

    public ActivityLogDTO() {}

    public ActivityLogDTO(Long id, String action, String itemName, LocalDateTime timestamp) {
        this.id = id; this.action = action; this.itemName = itemName; this.timestamp = timestamp;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String action, itemName;
        private LocalDateTime timestamp;
        public Builder id(Long v)               { this.id = v; return this; }
        public Builder action(String v)         { this.action = v; return this; }
        public Builder itemName(String v)       { this.itemName = v; return this; }
        public Builder timestamp(LocalDateTime v){ this.timestamp = v; return this; }
        public ActivityLogDTO build() { return new ActivityLogDTO(id, action, itemName, timestamp); }
    }

    public Long getId()                       { return id; }
    public void setId(Long v)                 { this.id = v; }
    public String getAction()                 { return action; }
    public void setAction(String v)           { this.action = v; }
    public String getItemName()               { return itemName; }
    public void setItemName(String v)         { this.itemName = v; }
    public LocalDateTime getTimestamp()       { return timestamp; }
    public void setTimestamp(LocalDateTime v) { this.timestamp = v; }
}
