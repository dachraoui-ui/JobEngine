package com.jobengine.job;

import com.jobengine.common.ApiResponse;
import com.jobengine.common.AuthUtils;
import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobType;
import com.jobengine.common.PagedResponse;
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

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final AuthUtils authUtils;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        JobResponse response = jobService.createJob(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "Job created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getAllJobs(
            @RequestParam(required = false) List<String> skills,
            @RequestParam(required = false) JobType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<JobResponse> jobs;
        if (skills != null || type != null || location != null || experienceLevel != null) {
            jobs = jobService.searchJobs(skills, type, location, experienceLevel);
        } else {
            jobs = jobService.getOpenJobs();
        }
        
        return ResponseEntity.ok(ApiResponse.success(com.jobengine.common.PaginationHelper.toPagedResponse(jobs, page, size)));
    }

    @GetMapping("/recommended")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getRecommendedJobs(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(jobService.getRecommendedJobs(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobById(id)));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobsByRecruiter(user.getId())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable String id,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        JobResponse response = jobService.updateJob(id, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Job updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        jobService.deleteJob(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Job deleted successfully"));
    }

}
