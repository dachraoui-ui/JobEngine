package com.jobengine.user;

import com.jobengine.common.Role;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private boolean isVerified;
    private boolean isActive;
    private LocalDateTime createdAt;
}
