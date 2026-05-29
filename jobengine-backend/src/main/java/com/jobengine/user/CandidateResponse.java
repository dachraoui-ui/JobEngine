package com.jobengine.user;

import com.jobengine.common.Role;
import com.jobengine.common.ExperienceLevel;
import com.jobengine.common.Visibility;
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
public class CandidateResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private boolean isVerified;
    private boolean isActive;
    private LocalDateTime createdAt;
    
    // Profile fields
    private List<String> skills;
    private ExperienceLevel experienceLevel;
    private List<String> values;
    private Visibility visibility;
    private String cvId;
}
