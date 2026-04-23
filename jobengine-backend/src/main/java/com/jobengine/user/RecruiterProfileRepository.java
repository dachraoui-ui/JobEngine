package com.jobengine.user;


import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RecruiterProfileRepository extends MongoRepository<RecruiterProfile, String> {
    Optional<RecruiterProfile> findByUserId(String userId);
}
