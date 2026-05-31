package com.jobengine.ai;

import com.jobengine.common.ApiResponse;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @PostMapping("/score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateScore(
            @RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<String> jobSkills = (List<String>) request.get("jobSkills");
        int jobExperience = (int) request.get("jobExperience");
        @SuppressWarnings("unchecked")
        List<String> jobValues = (List<String>) request.get("jobValues");
        @SuppressWarnings("unchecked")
        List<String> candidateSkills = (List<String>) request.get("candidateSkills");
        int candidateExperience = (int) request.get("candidateExperience");
        @SuppressWarnings("unchecked")
        List<String> candidateValues = (List<String>) request.get("candidateValues");

        Map<String, Object> result = matchingService.calculateMatchingScore(
                jobSkills, jobExperience, jobValues,
                candidateSkills, candidateExperience, candidateValues);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/career-advice")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCareerAdvice(
            @RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) request.get("skills");
        
        Object expObj = request.get("yearsExperience");
        int experience = 2; // fallback default
        if (expObj instanceof Number) {
            experience = ((Number) expObj).intValue();
        } else if (expObj instanceof String) {
            try {
                experience = Integer.parseInt((String) expObj);
            } catch (NumberFormatException e) {
                String expStr = ((String) expObj).toUpperCase();
                if (expStr.equals("JUNIOR")) experience = 1;
                else if (expStr.equals("MID")) experience = 4;
                else if (expStr.equals("SENIOR")) experience = 8;
            }
        }

        @SuppressWarnings("unchecked")
        List<String> targetJobs = (List<String>) request.get("targetJobTitles");
        if (targetJobs == null) {
            targetJobs = List.of("Full Stack Engineer", "DevOps Engineer", "Solutions Architect");
        }

        Map<String, Object> result = matchingService.getCareerAdvice(skills, experience, targetJobs);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
