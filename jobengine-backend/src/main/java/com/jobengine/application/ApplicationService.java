package com.jobengine.application;

import com.jobengine.common.ApplicationStatus;
import com.jobengine.common.DuplicateResourceException;
import com.jobengine.common.ResourceNotFoundException;
import com.jobengine.job.JobRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public Application applyToJob(String candidateId, String jobId, String cvId) {
        // Check job exists
        jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // Check duplicate application
        if (applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId)) {
            throw new DuplicateResourceException("You have already applied to this job");
        }

        Application.StatusHistoryEntry initialStatus = Application.StatusHistoryEntry.builder()
                .status(ApplicationStatus.APPLIED)
                .changedAt(LocalDateTime.now())
                .changedBy(candidateId)
                .build();

        Application application = Application.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .cvId(cvId)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .statusHistory(new ArrayList<>(List.of(initialStatus)))
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByCandidateId(String candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    public List<Application> getApplicationsByJobId(String jobId) {
        return applicationRepository.findByJobIdOrderByMatchingScoreDesc(jobId);
    }

    public Application getApplicationById(String id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    public Application updateStatus(String applicationId, ApplicationStatus newStatus, String changedBy) {
        Application application = getApplicationById(applicationId);

        Application.StatusHistoryEntry historyEntry = Application.StatusHistoryEntry.builder()
                .status(newStatus)
                .changedAt(LocalDateTime.now())
                .changedBy(changedBy)
                .build();

        application.setStatus(newStatus);
        application.getStatusHistory().add(historyEntry);

        return applicationRepository.save(application);
    }

    /**
     * Get applications grouped by status for the pipeline Kanban board
     */
    public Map<ApplicationStatus, List<Application>> getPipelineByJobId(String jobId) {
        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream()
                .collect(Collectors.groupingBy(Application::getStatus));
    }

    /**
     * Update matching score from AI service
     */
    public Application updateMatchingScore(String applicationId, double score,
                                            Application.ScoreBreakdown breakdown,
                                            List<String> matchedSkills, List<String> missingSkills) {
        Application application = getApplicationById(applicationId);
        application.setMatchingScore(score);
        application.setScoreBreakdown(breakdown);
        application.setMatchedSkills(matchedSkills);
        application.setMissingSkills(missingSkills);
        return applicationRepository.save(application);
    }
}
