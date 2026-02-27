package com.apex.inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public ActivityLog() {}

    public ActivityLog(Long id, String action, String itemName, LocalDateTime timestamp) {
        this.id = id; this.action = action; this.itemName = itemName; this.timestamp = timestamp;
    }

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String action, itemName;
        private LocalDateTime timestamp;

        public Builder id(Long v)                { this.id = v; return this; }
        public Builder action(String v)          { this.action = v; return this; }
        public Builder itemName(String v)        { this.itemName = v; return this; }
        public Builder timestamp(LocalDateTime v){ this.timestamp = v; return this; }

        public ActivityLog build() {
            return new ActivityLog(id, action, itemName, timestamp);
        }
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
