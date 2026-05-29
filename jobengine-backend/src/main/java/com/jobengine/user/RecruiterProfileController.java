package com.jobengine.user;

import com.jobengine.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}")
@RequiredArgsConstructor
public class RecruiterProfileController {

    private final RecruiterProfileRepository recruiterProfileRepository;

    @GetMapping("/recruiter-profile")
    public ResponseEntity<ApiResponse<RecruiterProfile>> getProfile(@PathVariable String userId) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    RecruiterProfile newProfile = RecruiterProfile.builder()
                            .userId(userId)
                            .build();
                    return recruiterProfileRepository.save(newProfile);
                });
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/recruiter-profile")
    public ResponseEntity<ApiResponse<RecruiterProfile>> updateProfile(
            @PathVariable String userId,
            @RequestBody RecruiterProfile updates) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(userId)
                .orElseGet(() -> RecruiterProfile.builder().userId(userId).build());

        if (updates.getCompanyName() != null) {
            profile.setCompanyName(updates.getCompanyName());
        }
        if (updates.getCompanyDescription() != null) {
            profile.setCompanyDescription(updates.getCompanyDescription());
        }
        if (updates.getCompanyValues() != null) {
            profile.setCompanyValues(updates.getCompanyValues());
        }
        if (updates.getIndustry() != null) {
            profile.setIndustry(updates.getIndustry());
        }
        if (updates.getWebsite() != null) {
            profile.setWebsite(updates.getWebsite());
        }
        if (updates.getCompanySize() != null) {
            profile.setCompanySize(updates.getCompanySize());
        }

        RecruiterProfile saved = recruiterProfileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.success(saved, "Company profile updated successfully"));
    }
}
