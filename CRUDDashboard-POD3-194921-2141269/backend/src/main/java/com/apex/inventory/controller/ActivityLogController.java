package com.apex.inventory.controller;

import com.apex.inventory.dto.ActivityLogDTO;
import com.apex.inventory.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activity-log")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityLogDTO>> getRecentLogs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(activityLogService.getRecentLogs(limit));
    }
}
