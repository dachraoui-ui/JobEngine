package com.jobengine.auth;

import com.jobengine.common.Role;
import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String credential; // The Google JWT token
    private Role role; // Optional, required only for first-time registration
    private Boolean isRegistration; // True if coming from register page, false if from login page
}
