package com.jobengine.job;

import com.jobengine.common.JobStatus;


import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByRecruiterId(String recruiterId);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByRequiredSkillsIn(List<String> skills);
}
