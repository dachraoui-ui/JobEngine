package com.jobengine.cv;

import com.jobengine.common.ApiResponse;
import com.jobengine.common.AuthUtils;
import com.jobengine.user.User;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvService cvService;
    private final AuthUtils authUtils;
    private final com.jobengine.ai.MatchingService matchingService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadCv(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = authUtils.getUserFromDetails(userDetails);
        Cv cv = cvService.uploadCv(file, user.getId());

        // Parse CV details using Gemini
        Map<String, Object> parseResult = matchingService.parseCv(cv.getFileData(), cv.getOriginalFileName());

        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) parseResult.getOrDefault("detectedSkills", java.util.List.of());
        
        int exp = 3;
        Object expObj = parseResult.get("yearsExperience");
        if (expObj instanceof Number) {
            exp = ((Number) expObj).intValue();
        }
        
        String edu = (String) parseResult.getOrDefault("education", "");
        
        @SuppressWarnings("unchecked")
        List<String> languages = (List<String>) parseResult.getOrDefault("languages", java.util.List.of());
        
        int strengthScore = 70;
        Object scoreObj = parseResult.get("cvStrengthScore");
        if (scoreObj instanceof Number) {
            strengthScore = ((Number) scoreObj).intValue();
        }

        String extractedText = (String) parseResult.getOrDefault("extractedText", "");

        // Save parsed details into the Cv entity
        cvService.updateParsedData(cv.getId(), extractedText, skills, exp, edu, languages, strengthScore);

        Map<String, Object> responseData = Map.of(
                "cvId", cv.getId(),
                "fileName", cv.getOriginalFileName(),
                "fileSize", String.format("%.1f MB", (double) file.getSize() / (1024 * 1024)),
                "detectedSkills", skills,
                "yearsExperience", exp,
                "education", edu,
                "languages", languages,
                "cvStrengthScore", strengthScore
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(responseData, "CV uploaded and parsed successfully"));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getActiveCv(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        try {
            Cv cv = cvService.getCvByUserId(user.getId());
        
            Map<String, Object> info = new java.util.HashMap<>();
            info.put("id", cv.getId());
            info.put("userId", cv.getUserId());
            info.put("originalFileName", cv.getOriginalFileName());
            info.put("fileType", cv.getFileType());
            info.put("detectedSkills", cv.getDetectedSkills() != null ? cv.getDetectedSkills() : java.util.List.of());
            info.put("yearsExperience", cv.getYearsExperience());
            info.put("education", cv.getEducation() != null ? cv.getEducation() : "");
            info.put("languages", cv.getLanguages() != null ? cv.getLanguages() : java.util.List.of());
            info.put("cvStrengthScore", cv.getCvStrengthScore());
            info.put("uploadedAt", cv.getUploadedAt().toString());
            info.put("fileSize", String.format("%.1f MB", (double) cv.getFileData().length / (1024 * 1024)));

        return ResponseEntity.ok(ApiResponse.success(info));
    } catch (com.jobengine.common.ResourceNotFoundException e) {
        return ResponseEntity.ok(ApiResponse.success(null, "No active CV found"));
    }
    }

    @PostMapping("/upload/candidate/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadCandidateCv(
            @RequestParam("file") MultipartFile file,
            @PathVariable String candidateId) throws IOException {

        Cv cv = cvService.uploadCv(file, candidateId);

        // ✅ Ajouter l'analyse IA (même logique que l'upload candidat)
        Map<String, Object> parseResult = matchingService.parseCv(cv.getFileData(), cv.getOriginalFileName());

        List<String> skills = (List<String>) parseResult.getOrDefault("detectedSkills", List.of());

        int exp = 3;
        Object expObj = parseResult.get("yearsExperience");
        if (expObj instanceof Number) exp = ((Number) expObj).intValue();

        String edu = (String) parseResult.getOrDefault("education", "");

        List<String> languages = (List<String>) parseResult.getOrDefault("languages", List.of());

        int strengthScore = 70;
        Object scoreObj = parseResult.get("cvStrengthScore");
        if (scoreObj instanceof Number) strengthScore = ((Number) scoreObj).intValue();

        String extractedText = (String) parseResult.getOrDefault("extractedText", "");

        cvService.updateParsedData(cv.getId(), extractedText, skills, exp, edu, languages, strengthScore);

        Map<String, Object> responseData = Map.of(
            "cvId", cv.getId(),
            "fileName", cv.getOriginalFileName(),
            "detectedSkills", skills,
            "yearsExperience", exp,
            "education", edu,
            "languages", languages,
            "cvStrengthScore", strengthScore
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(responseData, "Candidate CV uploaded and parsed successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCvInfo(@PathVariable String id) {
        Cv cv = cvService.getCvById(id);
        Map<String, Object> info = Map.of(
                "id", cv.getId(),
                "userId", cv.getUserId(),
                "originalFileName", cv.getOriginalFileName(),
                "fileType", cv.getFileType(),
                "extractedText", cv.getExtractedText() != null ? cv.getExtractedText() : "",
                "detectedSkills", cv.getDetectedSkills() != null ? cv.getDetectedSkills() : java.util.List.of(),
                "yearsExperience", cv.getYearsExperience(),
                "education", cv.getEducation() != null ? cv.getEducation() : "",
                "cvStrengthScore", cv.getCvStrengthScore(),
                "uploadedAt", cv.getUploadedAt().toString()
        );
        return ResponseEntity.ok(ApiResponse.success(info));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCv(@PathVariable String id) {
        Cv cv = cvService.getCvById(id);
        String contentType = cv.getFileType().equals("PDF")
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cv.getOriginalFileName() + "\"")
                .body(cv.getFileData());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCv(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authUtils.getUserFromDetails(userDetails);
        cvService.deleteCv(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "CV deleted successfully"));
    }

}
