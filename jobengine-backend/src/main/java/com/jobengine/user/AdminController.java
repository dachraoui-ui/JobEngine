package com.jobengine.user;

import com.jobengine.application.ApplicationRepository;
import com.jobengine.common.ApiResponse;
import com.jobengine.job.JobRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("pendingRecruiters", userService.getPendingRecruiters().size());

        // Role breakdown
        long candidateCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.jobengine.common.Role.CANDIDATE)
                .count();
        long recruiterCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.jobengine.common.Role.RECRUITER)
                .count();
        stats.put("candidateCount", candidateCount);
        stats.put("recruiterCount", recruiterCount);

        // Status breakdown
        Map<String, Long> statusBreakdown = applicationRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        a -> a.getStatus().name(),
                        java.util.stream.Collectors.counting()
                ));
        stats.put("statusBreakdown", statusBreakdown);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettings>> getSettings() {
        SystemSettings settings = systemSettingsRepository.findById("GLOBAL")
                .orElseGet(() -> {
                    SystemSettings defaultSettings = SystemSettings.builder()
                            .id("GLOBAL")
                            .matchingThreshold(60.0)
                            .autoRejectScore(40.0)
                            .autoRejectEnabled(false)
                            .build();
                    return systemSettingsRepository.save(defaultSettings);
                });
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettings>> updateSettings(@RequestBody SystemSettings updates) {
        SystemSettings settings = systemSettingsRepository.findById("GLOBAL")
                .orElseGet(() -> SystemSettings.builder().id("GLOBAL").build());

        if (updates.getMatchingThreshold() > 0) {
            settings.setMatchingThreshold(updates.getMatchingThreshold());
        }
        if (updates.getAutoRejectScore() > 0) {
            settings.setAutoRejectScore(updates.getAutoRejectScore());
        }
        settings.setAutoRejectEnabled(updates.isAutoRejectEnabled());

        SystemSettings saved = systemSettingsRepository.save(settings);
        return ResponseEntity.ok(ApiResponse.success(saved, "System settings updated successfully"));
    }

    @GetMapping("/pending-recruiters")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getPendingRecruiters() {
        return ResponseEntity.ok(ApiResponse.success(userService.getPendingRecruiters()));
    }

    @PutMapping("/verify/{id}")
    public ResponseEntity<ApiResponse<Void>> verifyRecruiter(@PathVariable String id) {
        userService.verifyRecruiter(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Recruiter verified successfully"));
    }
}
