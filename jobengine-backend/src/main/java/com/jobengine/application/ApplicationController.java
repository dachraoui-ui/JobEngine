package com.jobengine.application;

import com.jobengine.common.ApiResponse;
import com.jobengine.common.ApplicationStatus;
import com.jobengine.user.User;
import com.jobengine.user.UserRepository;
import com.jobengine.webhook.WebhookService;


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
    private final UserRepository userRepository;
    private final WebhookService webhookService;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Application>> applyToJob(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromDetails(userDetails);
        String jobId = body.get("jobId");
        String cvId = body.get("cvId");

        Application application = applicationService.applyToJob(user.getId(), jobId, cvId);

        // Send webhook to n8n
        webhookService.sendNewApplicationWebhook(Map.of(
                "applicationId", application.getId(),
                "candidateName", user.getFirstName() + " " + user.getLastName(),
                "jobId", jobId
        ));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(application, "Application submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Application>>> getApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromDetails(userDetails);
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
        User user = getUserFromDetails(userDetails);
        Application updated = applicationService.updateStatus(id, request.getStatus(), user.getId());

        // Send webhook to n8n
        webhookService.sendStatusChangeWebhook(Map.of(
                "applicationId", updated.getId(),
                "newStatus", updated.getStatus().name(),
                "changedBy", user.getFirstName() + " " + user.getLastName()
        ));

        return ResponseEntity.ok(ApiResponse.success(updated, "Status updated"));
    }

    @GetMapping("/job/{jobId}/pipeline")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<ApplicationStatus, List<Application>>>> getPipeline(
            @PathVariable String jobId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getPipelineByJobId(jobId)));
    }

    private User getUserFromDetails(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
