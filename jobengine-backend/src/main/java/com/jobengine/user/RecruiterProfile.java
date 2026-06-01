package com.jobengine.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@Document("recruiter_profiles")
public class RecruiterProfile {

    @PersistenceCreator
    public RecruiterProfile() {
    }

    @Id
    private String id;

    private String userId;

    private String companyName;
    private String companyDescription;
    private List<String> companyValues;
    private String industry;
    private String website;
    private String companySize;
}

