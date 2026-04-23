package com.jobengine.application;

import com.jobengine.common.ApplicationStatus;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("applications")
public class Application {

    @Id
    private String id;

    private String candidateId;
    private String jobId;
    private String cvId;

    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private double matchingScore;

    private ScoreBreakdown scoreBreakdown;

    private List<String> matchedSkills;
    private List<String> missingSkills;

    private LocalDateTime appliedAt;

    @Builder.Default
    private List<StatusHistoryEntry> statusHistory = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreBreakdown {
        private double skills;
        private double experience;
        private double culture;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusHistoryEntry {
        private ApplicationStatus status;
        private LocalDateTime changedAt;
        private String changedBy;
    }
}
