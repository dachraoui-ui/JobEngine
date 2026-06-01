package com.jobengine.job;

import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobStatus;
import com.jobengine.common.JobType;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Document("jobs")
public class Job {

    @PersistenceCreator
    public Job() {
    }

    @Id
    private String id;

    private String recruiterId;

    private String title;
    private String description;
    private String location;

    private JobType type;

    private List<String> requiredSkills;

    private ExperienceLevel experienceLevel;

    private List<String> companyValues;

    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime deadline;
}
