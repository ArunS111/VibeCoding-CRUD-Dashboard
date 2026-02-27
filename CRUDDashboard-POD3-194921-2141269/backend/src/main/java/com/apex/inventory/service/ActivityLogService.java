package com.apex.inventory.service;

import com.apex.inventory.dto.ActivityLogDTO;
import com.apex.inventory.model.ActivityLog;
import com.apex.inventory.repository.ActivityLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void log(String action, String itemName) {
        ActivityLog entry = ActivityLog.builder()
                .action(action)
                .itemName(itemName)
                .build();
        activityLogRepository.save(entry);
    }

    public List<ActivityLogDTO> getRecentLogs(int limit) {
        return activityLogRepository
                .findAllByOrderByTimestampDesc(PageRequest.of(0, limit))
                .stream()
                .map(l -> ActivityLogDTO.builder()
                        .id(l.getId())
                        .action(l.getAction())
                        .itemName(l.getItemName())
                        .timestamp(l.getTimestamp())
                        .build())
                .toList();
    }
}
