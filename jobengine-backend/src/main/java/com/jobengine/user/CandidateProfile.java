package com.jobengine.user;

import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.JobType;
import com.jobengine.common.Visibility;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("candidate_profiles")
public class CandidateProfile {

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
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Preferences {
        private JobType jobType;
        private String location;
        @Builder.Default
        private boolean remoteOk = false;
    }
}
