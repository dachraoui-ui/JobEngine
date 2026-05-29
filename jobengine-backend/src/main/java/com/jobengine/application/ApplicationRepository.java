package com.jobengine.application;


import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByCandidateId(String candidateId);
    List<Application> findByJobId(String jobId);
    List<Application> findByJobIdIn(List<String> jobIds);
    List<Application> findByJobIdOrderByMatchingScoreDesc(String jobId);
    boolean existsByCandidateIdAndJobId(String candidateId, String jobId);
}
