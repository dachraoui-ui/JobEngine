package com.jobengine.job;

import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobStatus;
import com.jobengine.common.JobType;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private String id;
    private String recruiterId;
    private String recruiterName;
    private String companyName;
    private String title;
    private String description;
    private String location;
    private JobType type;
    private List<String> requiredSkills;
    private ExperienceLevel experienceLevel;
    private List<String> companyValues;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private int applicantCount;
}
