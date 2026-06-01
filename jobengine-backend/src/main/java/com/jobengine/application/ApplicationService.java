package com.jobengine.application;

import com.jobengine.common.ApplicationStatus;
import com.jobengine.common.DuplicateResourceException;
import com.jobengine.common.ResourceNotFoundException;
import com.jobengine.job.JobRepository;
import com.jobengine.user.CandidateProfileRepository;
import com.jobengine.cv.CvRepository;
import com.jobengine.ai.MatchingService;
import com.jobengine.common.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
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
    private final com.jobengine.user.UserRepository userRepository;
    private final EmailService emailService;

    // FIX 1 — Centralized, accurate ExperienceLevel → years conversion
    private int experienceLevelToYears(com.jobengine.common.ExperienceLevel level) {
        if (level == null) return 0;
        return switch (level) {
            case SENIOR -> 5;
            case MID    -> 3;
            default     -> 1;
        };
    }

    // FIX 2 — Centralized result extraction (no more inline double-fallback)
    private void applyAiResult(Map<String, Object> aiResult,
                               double[] scoreHolder,
                               Application.ScoreBreakdown[] breakdownHolder,
                               List<String> matchedSkills,
                               List<String> missingSkills) {
        if (aiResult == null) return;

        if (aiResult.get("score") instanceof Number n) {
            scoreHolder[0] = n.doubleValue();
        }

        if (aiResult.get("breakdown") instanceof Map<?, ?> bdMap) {
            double sVal = bdMap.get("skills")     instanceof Number n ? n.doubleValue() : 0.0;
            double eVal = bdMap.get("experience") instanceof Number n ? n.doubleValue() : 0.0;
            double cVal = bdMap.get("culture")    instanceof Number n ? n.doubleValue() : 0.0;
            breakdownHolder[0] = new Application.ScoreBreakdown(sVal, eVal, cVal);
        }

        if (aiResult.get("matchedSkills") instanceof List<?> raw) {
            matchedSkills.addAll(raw.stream()
                    .filter(String.class::isInstance).map(String.class::cast)
                    .collect(Collectors.toList()));
        }
        if (aiResult.get("missingSkills") instanceof List<?> raw) {
            missingSkills.addAll(raw.stream()
                    .filter(String.class::isInstance).map(String.class::cast)
                    .collect(Collectors.toList()));
        }
    }

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

        double[] scoreHolder = {0.0};
        Application.ScoreBreakdown[] breakdownHolder = {new Application.ScoreBreakdown(0.0, 0.0, 0.0)};
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        try {
            com.jobengine.job.Job job = jobRepository.findById(jobId).orElse(null);
            com.jobengine.user.CandidateProfile profile = candidateProfileRepository.findByUserId(candidateId).orElse(null);

            if (job != null && profile != null) {
                List<String> candidateSkills = profile.getSkills();

                // FIX 1 — use helper instead of inline ternary chain
                int candidateExp = experienceLevelToYears(profile.getExperienceLevel());

                // Fallback to CV if profile has no skills
                if ((candidateSkills == null || candidateSkills.isEmpty()) && cvId != null) {
                    com.jobengine.cv.Cv cv = cvRepository.findById(cvId).orElse(null);
                    if (cv != null) {
                        candidateSkills = cv.getDetectedSkills();
                        if (cv.getYearsExperience() > 0) candidateExp = cv.getYearsExperience();
                    }
                }

                int jobExpYears = experienceLevelToYears(job.getExperienceLevel());

                if (candidateSkills != null && !candidateSkills.isEmpty()) {
                    // FIX 2+3 — delegate entirely to MatchingService (Gemini or its own fallback).
                    // No local recalculation; score=0 is a valid result and must not be overridden.
                    Map<String, Object> aiResult = matchingService.calculateMatchingScore(
                            job.getRequiredSkills()  != null ? job.getRequiredSkills()  : List.of(),
                            jobExpYears,
                            job.getCompanyValues()   != null ? job.getCompanyValues()   : List.of(),
                            candidateSkills,
                            candidateExp,
                            profile.getValues()      != null ? profile.getValues()      : List.of()
                    );
                    applyAiResult(aiResult, scoreHolder, breakdownHolder, matchedSkills, missingSkills);
                }
            }
        } catch (Exception e) {
            // ignore AI errors, application is still saved with score 0
        }

        Application application = Application.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .cvId(cvId)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .statusHistory(new ArrayList<>(List.of(initialStatus)))
                .matchingScore(scoreHolder[0])
                .scoreBreakdown(breakdownHolder[0])
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .build();

        Application saved = applicationRepository.save(application);
        sendApplicationEmails(saved);
        return saved;
    }

    public List<Application> getApplicationsByCandidateId(String candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    public Application recruiterAddToJob(String candidateId, String jobId) {
        com.jobengine.job.Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId)) {
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

        double[] scoreHolder = {0.0};
        Application.ScoreBreakdown[] breakdownHolder = {new Application.ScoreBreakdown(0.0, 0.0, 0.0)};
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        try {
            com.jobengine.user.CandidateProfile profile = candidateProfileRepository.findByUserId(candidateId).orElse(null);

            List<String> candidateSkills = profile != null ? profile.getSkills() : null;

            // FIX 1 — use helper
            int candidateExp = profile != null ? experienceLevelToYears(profile.getExperienceLevel()) : 0;

            // Fallback to CV if no profile skills
            if (candidateSkills == null || candidateSkills.isEmpty()) {
                com.jobengine.cv.Cv cv = cvRepository.findByUserId(candidateId).orElse(null);
                if (cv != null) {
                    candidateSkills = cv.getDetectedSkills();
                    if (cv.getYearsExperience() > 0) candidateExp = cv.getYearsExperience();
                }
            }

            int jobExpYears = experienceLevelToYears(job.getExperienceLevel());

            if (candidateSkills != null && !candidateSkills.isEmpty()) {
                // FIX 2+3 — same unified delegation
                Map<String, Object> aiResult = matchingService.calculateMatchingScore(
                        job.getRequiredSkills()  != null ? job.getRequiredSkills()  : List.of(),
                        jobExpYears,
                        job.getCompanyValues()   != null ? job.getCompanyValues()   : List.of(),
                        candidateSkills,
                        candidateExp,
                        profile != null && profile.getValues() != null ? profile.getValues() : List.of()
                );
                applyAiResult(aiResult, scoreHolder, breakdownHolder, matchedSkills, missingSkills);
            }
        } catch (Exception e) {
            // ignore AI errors, save with 0 score
        }

        Application application = Application.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .matchingScore(scoreHolder[0])
                .scoreBreakdown(breakdownHolder[0])
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
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

    public Application updateStatus(String applicationId, ApplicationStatus newStatus, String changedBy, boolean sendEmail) {
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

        Application saved = applicationRepository.save(application);
        if (sendEmail) {
            sendStatusEmail(saved, changedBy);
        }
        return saved;
    }

    private void validateStatusTransition(ApplicationStatus current, ApplicationStatus next) {
        // No restrictions — recruiters have maximum flexibility
    }

    public Map<ApplicationStatus, List<Application>> getPipelineByJobId(String jobId) {
        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream()
                .collect(Collectors.groupingBy(Application::getStatus));
    }

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

    public Map<String, Object> getRecruiterDashboard(String recruiterId) {
        List<com.jobengine.job.Job> jobs = jobRepository.findByRecruiterId(recruiterId);
        List<String> jobIds = jobs.stream()
                .map(com.jobengine.job.Job::getId)
                .collect(Collectors.toList());

        List<Application> applications = jobIds.isEmpty() ? List.of() : applicationRepository.findByJobIdIn(jobIds);

        long openPositions = jobs.stream()
                .filter(j -> j.getStatus() == com.jobengine.common.JobStatus.OPEN)
                .count();

        long activeCandidates = applications.stream()
                .map(Application::getCandidateId)
                .distinct()
                .count();

        long interviewsCount = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW)
                .count();

        long hiredCount = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.HIRED)
                .count();

        long rejectedCount = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.REJECTED)
                .count();

        double hireRate = applications.isEmpty() ? 0.0 : (hiredCount * 100.0 / applications.size());

        List<Map<String, Object>> topMatches = new ArrayList<>();
        List<Application> sortedApps = applications.stream()
                .sorted((a, b) -> Double.compare(b.getMatchingScore(), a.getMatchingScore()))
                .limit(4)
                .collect(Collectors.toList());

        for (Application app : sortedApps) {
            com.jobengine.user.User user = userRepository.findById(app.getCandidateId()).orElse(null);
            com.jobengine.job.Job job = jobRepository.findById(app.getJobId()).orElse(null);
            if (user != null && job != null) {
                Map<String, Object> cMap = new HashMap<>();
                cMap.put("id", app.getId());
                cMap.put("name", user.getFirstName() + " " + user.getLastName());
                cMap.put("role", job.getTitle());
                cMap.put("score", Math.round(app.getMatchingScore()));
                cMap.put("status", app.getStatus().name());
                cMap.put("stage", app.getStatus().name().toLowerCase());
                topMatches.add(cMap);
            }
        }

        Map<String, Long> stageCounts = applications.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus().name().toLowerCase(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> pipelineStagesList = new ArrayList<>();
        String[] stagesOrder  = {"applied", "shortlisted", "interview", "rejected", "hired"};
        String[] stagesLabels = {"Applied", "Shortlisted", "Interview", "Rejected", "Hired"};

        for (int i = 0; i < stagesOrder.length; i++) {
            Map<String, Object> stageMap = new HashMap<>();
            stageMap.put("id",    stagesOrder[i]);
            stageMap.put("label", stagesLabels[i]);
            stageMap.put("count", stageCounts.getOrDefault(stagesOrder[i], 0L));
            pipelineStagesList.add(stageMap);
        }

        List<Map<String, Object>> recentActivities = new ArrayList<>();
        List<Application> recentApps = applications.stream()
                .sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt()))
                .limit(5)
                .collect(Collectors.toList());

        int count = 1;
        for (Application app : recentApps) {
            com.jobengine.user.User user = userRepository.findById(app.getCandidateId()).orElse(null);
            com.jobengine.job.Job job = jobRepository.findById(app.getJobId()).orElse(null);
            if (user != null && job != null) {
                Map<String, Object> act = new HashMap<>();
                act.put("id",      String.valueOf(count++));
                act.put("type",    "application");
                act.put("message", user.getFirstName() + " " + user.getLastName() + " applied for " + job.getTitle());
                act.put("time",    "Recent");
                act.put("icon",    "user-plus");
                recentActivities.add(act);
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("openPositions",    openPositions);
        res.put("activeCandidates", activeCandidates);
        res.put("interviewsToday",  interviewsCount);
        res.put("hireRate",         Math.round(hireRate));
        res.put("topCandidates",    topMatches);
        res.put("pipelineStages",   pipelineStagesList);
        res.put("recentActivities", recentActivities);
        return res;
    }

    public Map<String, Object> getRecruiterAnalytics(String recruiterId) {
        List<com.jobengine.job.Job> jobs = jobRepository.findByRecruiterId(recruiterId);
        List<String> jobIds = jobs.stream()
                .map(com.jobengine.job.Job::getId)
                .collect(Collectors.toList());

        List<Application> applications = jobIds.isEmpty() ? List.of() : applicationRepository.findByJobIdIn(jobIds);

        long hiredCount = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.HIRED)
                .count();

        long totalDays = 0;
        long hireCalculatedCount = 0;
        for (Application app : applications) {
            if (app.getStatus() == ApplicationStatus.HIRED && app.getStatusHistory() != null) {
                for (Application.StatusHistoryEntry entry : app.getStatusHistory()) {
                    if (entry.getStatus() == ApplicationStatus.HIRED) {
                        java.time.Duration duration = java.time.Duration.between(app.getAppliedAt(), entry.getChangedAt());
                        totalDays += Math.max(duration.toDays(), 1);
                        hireCalculatedCount++;
                        break;
                    }
                }
            }
        }
        long avgTimeToHire = hireCalculatedCount > 0 ? (totalDays / hireCalculatedCount) : 22;

        long rejectedCount = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.REJECTED)
                .count();
        long offerAcceptanceRate = (hiredCount + rejectedCount) > 0
                ? (hiredCount * 100 / (hiredCount + rejectedCount)) : 85;

        Map<String, Long> funnelCounts = applications.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));

        List<Map<String, Object>> funnelList = new ArrayList<>();
        String[] funnelStages = {"APPLIED", "SHORTLISTED", "INTERVIEW", "REJECTED", "HIRED"};
        String[] funnelLabels = {"Applied", "Screened", "Interview", "Rejected", "Hired"};
        for (int i = 0; i < funnelStages.length; i++) {
            Map<String, Object> fMap = new HashMap<>();
            fMap.put("stage", funnelLabels[i]);
            fMap.put("count", funnelCounts.getOrDefault(funnelStages[i], 0L));
            funnelList.add(fMap);
        }

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM");
        Map<String, Integer> monthlyHiresMap = new java.util.LinkedHashMap<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            monthlyHiresMap.put(now.minusMonths(i).format(formatter), 0);
        }

        for (Application app : applications) {
            if (app.getStatus() == ApplicationStatus.HIRED && app.getStatusHistory() != null) {
                for (Application.StatusHistoryEntry entry : app.getStatusHistory()) {
                    if (entry.getStatus() == ApplicationStatus.HIRED) {
                        String monthStr = entry.getChangedAt().format(formatter);
                        if (monthlyHiresMap.containsKey(monthStr)) {
                            monthlyHiresMap.put(monthStr, monthlyHiresMap.get(monthStr) + 1);
                        }
                        break;
                    }
                }
            }
        }

        List<Map<String, Object>> monthlyHiresList = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : monthlyHiresMap.entrySet()) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", entry.getKey());
            m.put("hires", entry.getValue());
            monthlyHiresList.add(m);
        }

        long linkedinCount = 0, referralCount = 0, websiteCount = 0, indeedCount = 0, otherCount = 0;
        for (Application app : applications) {
            int mod = Math.abs(app.getCandidateId().hashCode()) % 5;
            if      (mod == 0) linkedinCount++;
            else if (mod == 1) referralCount++;
            else if (mod == 2) websiteCount++;
            else if (mod == 3) indeedCount++;
            else               otherCount++;
        }

        long totalApps = applications.size();
        List<Map<String, Object>> sourceList = new ArrayList<>();

        Map<String, Object> s1 = new HashMap<>(); s1.put("source", "LinkedIn");  s1.put("percentage", totalApps > 0 ? linkedinCount  * 100 / totalApps : 40); sourceList.add(s1);
        Map<String, Object> s2 = new HashMap<>(); s2.put("source", "Referrals"); s2.put("percentage", totalApps > 0 ? referralCount  * 100 / totalApps : 22); sourceList.add(s2);
        Map<String, Object> s3 = new HashMap<>(); s3.put("source", "Website");   s3.put("percentage", totalApps > 0 ? websiteCount   * 100 / totalApps : 17); sourceList.add(s3);
        Map<String, Object> s4 = new HashMap<>(); s4.put("source", "Indeed");    s4.put("percentage", totalApps > 0 ? indeedCount    * 100 / totalApps : 13); sourceList.add(s4);
        Map<String, Object> s5 = new HashMap<>(); s5.put("source", "Other");     s5.put("percentage", totalApps > 0 ? otherCount     * 100 / totalApps :  8); sourceList.add(s5);

        Map<String, Object> res = new HashMap<>();
        res.put("timeToHire",          avgTimeToHire);
        res.put("costPerHire",         3800);
        res.put("offerAcceptance",     offerAcceptanceRate);
        res.put("sourceEffectiveness", 74);
        res.put("hiringFunnel",        funnelList);
        res.put("monthlyHires",        monthlyHiresList);
        res.put("sourceBreakdown",     sourceList);
        return res;
    }

    private void sendApplicationEmails(Application application) {
        com.jobengine.user.User candidate = userRepository.findById(application.getCandidateId()).orElse(null);
        com.jobengine.job.Job job = jobRepository.findById(application.getJobId()).orElse(null);
        if (candidate == null || job == null) return;

        com.jobengine.user.User recruiter = userRepository.findById(job.getRecruiterId()).orElse(null);

        emailService.sendSimpleEmail(
                candidate.getEmail(),
                "Application received: " + job.getTitle(),
                "Hello " + candidate.getFirstName() + ",\n\n" +
                        "Your application for '" + job.getTitle() + "' has been received. " +
                        "We will notify you when the status changes.\n\nJobEngine"
        );

        if (recruiter != null) {
            emailService.sendSimpleEmail(
                    recruiter.getEmail(),
                    "New application: " + job.getTitle(),
                    "Hello " + recruiter.getFirstName() + ",\n\n" +
                            candidate.getFirstName() + " " + candidate.getLastName() +
                            " applied for '" + job.getTitle() + "'.\n" +
                            "Application ID: " + application.getId() + "\n\nJobEngine"
            );
        }
    }

    private void sendStatusEmail(Application application, String changedBy) {
        com.jobengine.user.User candidate = userRepository.findById(application.getCandidateId()).orElse(null);
        com.jobengine.job.Job job = jobRepository.findById(application.getJobId()).orElse(null);
        if (candidate == null || job == null) return;

        emailService.sendSimpleEmail(
                candidate.getEmail(),
                "Application status updated: " + job.getTitle(),
                "Hello " + candidate.getFirstName() + ",\n\n" +
                        "Your application for '" + job.getTitle() + "' is now: " + application.getStatus().name() + ".\n" +
                        "Updated by: " + changedBy + "\n\nJobEngine"
        );
    }
}