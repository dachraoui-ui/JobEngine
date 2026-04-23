package com.jobengine.job;

import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobType;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String location;

    @NotNull(message = "Job type is required")
    private JobType type;

    private List<String> requiredSkills;

    private ExperienceLevel experienceLevel;

    private List<String> companyValues;

    private LocalDateTime deadline;
}
