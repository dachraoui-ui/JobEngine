package com.jobengine.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("cvs")
public class Cv {

    @Id
    private String id;

    private String userId;

    private String originalFileName;
    private String fileType; // PDF or DOCX

    private byte[] fileData; // Binary file content

    private String extractedText;
    private List<String> detectedSkills;
    private int yearsExperience;
    private String education;
    private List<String> languages;

    private LocalDateTime uploadedAt;
}
