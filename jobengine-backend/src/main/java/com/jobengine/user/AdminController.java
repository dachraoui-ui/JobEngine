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

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("pendingRecruiters", userService.getPendingRecruiters().size());
        return ResponseEntity.ok(ApiResponse.success(stats));
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
