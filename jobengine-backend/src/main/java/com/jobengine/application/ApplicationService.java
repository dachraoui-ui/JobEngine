package com.jobengine.application;

import com.jobengine.common.ApplicationStatus;
import com.jobengine.common.DuplicateResourceException;
import com.jobengine.common.ResourceNotFoundException;
import com.jobengine.job.JobRepository;
import com.jobengine.user.CandidateProfileRepository;
import com.jobengine.cv.CvRepository;
import com.jobengine.ai.MatchingService;


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
    private final CandidateProfileRepository candidateProfileRepository;
    private final CvRepository cvRepository;
    private final MatchingService matchingService;

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

        double score = 0.0;
        Application.ScoreBreakdown breakdown = new Application.ScoreBreakdown(0.0, 0.0, 0.0);
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        try {
            com.jobengine.job.Job job = jobRepository.findById(jobId).orElse(null);
            com.jobengine.user.CandidateProfile profile = candidateProfileRepository.findByUserId(candidateId).orElse(null);

            if (job != null && profile != null) {
                List<String> candidateSkills = profile.getSkills();
                int candidateExp = 0;
                if (profile.getExperienceLevel() != null) {
                    candidateExp = profile.getExperienceLevel() == com.jobengine.common.ExperienceLevel.SENIOR ? 5 :
                                   profile.getExperienceLevel() == com.jobengine.common.ExperienceLevel.MID ? 3 : 1;
                }

                if ((candidateSkills == null || candidateSkills.isEmpty()) && cvId != null) {
                    com.jobengine.cv.Cv cv = cvRepository.findById(cvId).orElse(null);
                    if (cv != null) {
                        candidateSkills = cv.getDetectedSkills();
                        if (cv.getYearsExperience() > 0) {
                            candidateExp = cv.getYearsExperience();
                        }
                    }
                }

                int jobExpYears = job.getExperienceLevel() == com.jobengine.common.ExperienceLevel.SENIOR ? 5 :
                                  job.getExperienceLevel() == com.jobengine.common.ExperienceLevel.MID ? 3 : 1;

                if (candidateSkills != null && !candidateSkills.isEmpty()) {
                    Map<String, Object> aiResult = matchingService.calculateMatchingScore(
                            job.getRequiredSkills() != null ? job.getRequiredSkills() : List.of(),
                            jobExpYears,
                            job.getCompanyValues() != null ? job.getCompanyValues() : List.of(),
                            candidateSkills,
                            candidateExp,
                            profile.getValues() != null ? profile.getValues() : List.of()
                    );

                    if (aiResult != null && aiResult.containsKey("score")) {
                        Object scoreObj = aiResult.get("score");
                        if (scoreObj instanceof Number) {
                            score = ((Number) scoreObj).doubleValue();
                        }
                    }

                    if (score <= 0.0) {
                        List<String> jobSkills = job.getRequiredSkills() != null ? job.getRequiredSkills() : List.of();
                        List<String> finalCandidateSkills = candidateSkills;
                        long matchedCount = jobSkills.stream()
                                .filter(s -> finalCandidateSkills.stream().anyMatch(cs -> cs.equalsIgnoreCase(s)))
                                .count();
                        
                        matchedSkills = jobSkills.stream()
                                .filter(s -> finalCandidateSkills.stream().anyMatch(cs -> cs.equalsIgnoreCase(s)))
                                .collect(Collectors.toList());
                                
                        missingSkills = jobSkills.stream()
                                .filter(s -> finalCandidateSkills.stream().noneMatch(cs -> cs.equalsIgnoreCase(s)))
                                .collect(Collectors.toList());

                        double skillScore = jobSkills.isEmpty() ? 100.0 : (matchedCount * 100.0 / jobSkills.size());
                        double expScore = candidateExp >= jobExpYears ? 100.0 : (candidateExp * 100.0 / jobExpYears);
                        score = (skillScore * 0.7) + (expScore * 0.3);
                        breakdown = new Application.ScoreBreakdown(skillScore, expScore, 100.0);
                    } else if (aiResult != null) {
                        if (aiResult.get("breakdown") instanceof Map) {
                            Map<?, ?> bdMap = (Map<?, ?>) aiResult.get("breakdown");
                            double sVal = bdMap.get("skills") instanceof Number ? ((Number) bdMap.get("skills")).doubleValue() : 0.0;
                            double eVal = bdMap.get("experience") instanceof Number ? ((Number) bdMap.get("experience")).doubleValue() : 0.0;
                            double cVal = bdMap.get("culture") instanceof Number ? ((Number) bdMap.get("culture")).doubleValue() : 0.0;
                            breakdown = new Application.ScoreBreakdown(sVal, eVal, cVal);
                        }
                        if (aiResult.get("matchedSkills") instanceof List) {
                            List<?> rawList = (List<?>) aiResult.get("matchedSkills");
                            matchedSkills = rawList.stream()
                                    .filter(String.class::isInstance)
                                    .map(String.class::cast)
                                    .collect(Collectors.toList());
                        }
                        if (aiResult.get("missingSkills") instanceof List) {
                            List<?> rawList = (List<?>) aiResult.get("missingSkills");
                            missingSkills = rawList.stream()
                                    .filter(String.class::isInstance)
                                    .map(String.class::cast)
                                    .collect(Collectors.toList());
                        }
                    }
                }
            }
        } catch (Exception e) {
            // ignore AI mismatch issues
        }

        Application application = Application.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .cvId(cvId)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .statusHistory(new ArrayList<>(List.of(initialStatus)))
                .matchingScore(score)
                .scoreBreakdown(breakdown)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByCandidateId(String candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    public Application recruiterAddToJob(String candidateId, String jobId) {
        jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId)) {
            // Already in pipeline — just return the existing application
            return applicationRepository.findByCandidateId(candidateId).stream()
                    .filter(a -> a.getJobId().equals(jobId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        }

        Application.StatusHistoryEntry initialStatus = Application.StatusHistoryEntry.builder()
                .status(ApplicationStatus.APPLIED)
                .changedAt(LocalDateTime.now())
                .changedBy("RECRUITER")
                .build();

        Application application = Application.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .matchingScore(0.0)
                .scoreBreakdown(new Application.ScoreBreakdown(0.0, 0.0, 0.0))
                .matchedSkills(new ArrayList<>())
                .missingSkills(new ArrayList<>())
                .statusHistory(new ArrayList<>(List.of(initialStatus)))
                .build();

        return applicationRepository.save(application);
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

        validateStatusTransition(application.getStatus(), newStatus);

        Application.StatusHistoryEntry historyEntry = Application.StatusHistoryEntry.builder()
                .status(newStatus)
                .changedAt(LocalDateTime.now())
                .changedBy(changedBy)
                .build();
        if (application.getStatusHistory() == null) {
            application.setStatusHistory(new ArrayList<>());
        }
        application.getStatusHistory().add(historyEntry);
        application.setStatus(newStatus);
        
        return applicationRepository.save(application);
    }

    private void validateStatusTransition(ApplicationStatus current, ApplicationStatus next) {
        if (current == next) return;
        if (current == ApplicationStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot change status of a rejected application.");
        }
        if (current == ApplicationStatus.HIRED) {
            throw new IllegalArgumentException("Cannot change status of a hired candidate.");
        }
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
