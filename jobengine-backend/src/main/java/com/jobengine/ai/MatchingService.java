package com.jobengine.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Calls the Python AI microservice (FastAPI) for:
 * - CV parsing
 * - Matching score calculation
 * - Career advice generation
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    /**
     * Send CV file to AI service for parsing.
     * POST /api/ai/parse
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> parseCv(byte[] fileData, String fileName) {
        try {
            String url = aiServiceUrl + "/api/ai/parse";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource fileResource = new ByteArrayResource(fileData) {
                @Override
                public String getFilename() {
                    return fileName;
                }
            };
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to call AI parse service: {}", e.getMessage());
            return Map.of("error", "AI service unavailable");
        }
    }

    /**
     * Calculate matching score between a job and a candidate.
     * POST /api/ai/match
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> calculateMatchingScore(
            List<String> jobSkills, int jobExperience, List<String> jobValues,
            List<String> candidateSkills, int candidateExperience, List<String> candidateValues) {
        try {
            String url = aiServiceUrl + "/api/ai/match";

            Map<String, Object> payload = Map.of(
                    "jobSkills", jobSkills,
                    "jobExperience", jobExperience,
                    "jobValues", jobValues,
                    "candidateSkills", candidateSkills,
                    "candidateExperience", candidateExperience,
                    "candidateValues", candidateValues
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to call AI matching service: {}", e.getMessage());
            return Map.of("score", 0, "error", "AI service unavailable");
        }
    }

    /**
     * Get career advice from AI service.
     * POST /api/ai/career-advice
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getCareerAdvice(List<String> skills, int experience, List<String> targetJobs) {
        try {
            String url = aiServiceUrl + "/api/ai/career-advice";

            Map<String, Object> payload = Map.of(
                    "skills", skills,
                    "yearsExperience", experience,
                    "targetJobTitles", targetJobs
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to call AI career service: {}", e.getMessage());
            return Map.of("error", "AI service unavailable");
        }
    }
}
