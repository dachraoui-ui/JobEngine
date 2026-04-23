package com.jobengine.cv;


import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CvRepository extends MongoRepository<Cv, String> {
    Optional<Cv> findByUserId(String userId);
}
