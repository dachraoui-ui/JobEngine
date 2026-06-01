package com.jobengine.user;

import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobType;
import com.jobengine.common.Visibility;


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
@Document("candidate_profiles")
public class CandidateProfile {

    @PersistenceCreator
    public CandidateProfile() {
    }

    @Id
    private String id;

    private String userId;

    private List<String> skills;

    private ExperienceLevel experienceLevel;

    private Preferences preferences;

    private List<String> values;

    @Builder.Default
    private Visibility visibility = Visibility.PUBLIC;

    private String cvId;

    private String summary;

    @Data
    @Builder
    @AllArgsConstructor
    public static class Preferences {
        @PersistenceCreator
        public Preferences() {
        }
        private JobType jobType;
        private String location;
        @Builder.Default
        private boolean remoteOk = false;
    }
}
