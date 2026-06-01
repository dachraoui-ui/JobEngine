package com.jobengine.application;

import com.jobengine.common.ApplicationStatus;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Document("applications")
public class Application {

    @PersistenceCreator
    public Application() {
    }

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
    @AllArgsConstructor
    public static class ScoreBreakdown {
        @PersistenceCreator
        public ScoreBreakdown() {
        }
        private double skills;
        private double experience;
        private double culture;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class StatusHistoryEntry {
        @PersistenceCreator
        public StatusHistoryEntry() {
        }
        private ApplicationStatus status;
        private LocalDateTime changedAt;
        private String changedBy;
    }
}
