package com.jobengine.cv;

import com.jobengine.common.ResourceNotFoundException;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CvService {

    private final CvRepository cvRepository;

    public Cv uploadCv(MultipartFile file, String userId) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException("File name is required");
        }

        String fileType;
        if (fileName.toLowerCase().endsWith(".pdf") ||
                (contentType != null && contentType.equals("application/pdf"))) {
            fileType = "PDF";
        } else if (fileName.toLowerCase().endsWith(".docx") ||
                (contentType != null && contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
            fileType = "DOCX";
        } else {
            throw new IllegalArgumentException("Only PDF and DOCX files are accepted");
        }

        // Validate file size (10MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 10MB");
        }

        // Delete old CV if exists
        cvRepository.findByUserId(userId).ifPresent(cvRepository::delete);

        // Save new CV
        Cv cv = Cv.builder()
                .userId(userId)
                .originalFileName(fileName)
                .fileType(fileType)
                .fileData(file.getBytes())
                .uploadedAt(LocalDateTime.now())
                .build();

        return cvRepository.save(cv);
    }

    public Cv getCvById(String id) {
        return cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV not found with id: " + id));
    }

    public Cv getCvByUserId(String userId) {
        return cvRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("CV not found for user: " + userId));
    }

    public void deleteCv(String id, String userId) {
        Cv cv = cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV not found with id: " + id));
        if (!cv.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own CV");
        }
        cvRepository.delete(cv);
    }

    /**
     * Called after AI service parses the CV — updates extracted data.
     */
    public Cv updateParsedData(String cvId, String extractedText, List<String> detectedSkills,
                                int yearsExperience, String education, List<String> languages,
                                int cvStrengthScore) {
        Cv cv = getCvById(cvId);
        cv.setExtractedText(extractedText);
        cv.setDetectedSkills(detectedSkills);
        cv.setYearsExperience(yearsExperience);
        cv.setEducation(education);
        cv.setLanguages(languages);
        cv.setCvStrengthScore(cvStrengthScore);
        return cvRepository.save(cv);
    }
}
