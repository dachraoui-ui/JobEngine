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

@RestController
@RequestMapping("/api/v1/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvService cvService;
    private final AuthUtils authUtils;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadCv(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = authUtils.getUserFromDetails(userDetails);
        Cv cv = cvService.uploadCv(file, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        Map.of("cvId", cv.getId(), "fileName", cv.getOriginalFileName()),
                        "CV uploaded successfully"));
    }

    @PostMapping("/upload/candidate/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadCandidateCv(
            @RequestParam("file") MultipartFile file,
            @PathVariable String candidateId) throws IOException {
        Cv cv = cvService.uploadCv(file, candidateId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        Map.of("cvId", cv.getId(), "fileName", cv.getOriginalFileName()),
                        "Candidate CV uploaded successfully"));
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
