package com.jobengine.user;

import com.jobengine.common.ApiResponse;
import com.jobengine.common.ResourceNotFoundException;
import com.jobengine.common.Visibility;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{userId}")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileRepository candidateProfileRepository;

    @GetMapping("/candidate-profile")
    public ResponseEntity<ApiResponse<CandidateProfile>> getProfile(@PathVariable String userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    CandidateProfile newProfile = CandidateProfile.builder()
                            .userId(userId)
                            .build();
                    return candidateProfileRepository.save(newProfile);
                });
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/candidate-profile")
    public ResponseEntity<ApiResponse<CandidateProfile>> updateProfile(
            @PathVariable String userId,
            @RequestBody CandidateProfile updates) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseGet(() -> CandidateProfile.builder().userId(userId).build());

        if (updates.getSkills() != null) {
            profile.setSkills(updates.getSkills());
        }
        if (updates.getExperienceLevel() != null) {
            profile.setExperienceLevel(updates.getExperienceLevel());
        }
        if (updates.getPreferences() != null) {
            profile.setPreferences(updates.getPreferences());
        }
        if (updates.getValues() != null) {
            profile.setValues(updates.getValues());
        }
        if (updates.getCvId() != null) {
            profile.setCvId(updates.getCvId());
        }
        if (updates.getSummary() != null) {
            profile.setSummary(updates.getSummary());
        }

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.success(saved, "Candidate profile updated successfully"));
    }

    @PutMapping("/visibility")
    public ResponseEntity<ApiResponse<CandidateProfile>> updateVisibility(
            @PathVariable String userId,
            @RequestParam Visibility visibility) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found for user: " + userId));

        profile.setVisibility(visibility);
        CandidateProfile saved = candidateProfileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.success(saved, "Visibility updated successfully"));
    }
}
