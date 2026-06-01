package com.jobengine.application;

import com.jobengine.common.ApiResponse;
import com.jobengine.common.ApplicationStatus;
import com.jobengine.common.AuthUtils;
import com.jobengine.user.User;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthUtils authUtils;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Application>> applyToJob(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        String jobId = body.get("jobId");
        String cvId = body.get("cvId");

        Application application = applicationService.applyToJob(user.getId(), jobId, cvId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(application, "Application submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Application>>> getApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        List<Application> applications = applicationService.getApplicationsByCandidateId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Application>> getApplicationById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationById(id)));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<List<Application>>> getApplicationsByJob(@PathVariable String jobId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationsByJobId(jobId)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Application>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        Application updated = applicationService.updateStatus(id, request.getStatus(), user.getId(), request.isSendEmail());

        return ResponseEntity.ok(ApiResponse.success(updated, "Status updated"));
    }

    @GetMapping("/job/{jobId}/pipeline")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<ApplicationStatus, List<Application>>>> getPipeline(
            @PathVariable String jobId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getPipelineByJobId(jobId)));
    }

    @PostMapping("/recruiter-add")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Application>> recruiterAddToJob(
            @RequestBody Map<String, String> body) {
        String candidateId = body.get("candidateId");
        String jobId = body.get("jobId");
        Application application = applicationService.recruiterAddToJob(candidateId, jobId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(application, "Candidate assigned to job successfully"));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(applicationService.getRecruiterDashboard(user.getId())));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(applicationService.getRecruiterAnalytics(user.getId())));
    }

}
