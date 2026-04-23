package com.jobengine.user;

import com.jobengine.common.Role;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password; // BCrypt hashed

    private String firstName;
    private String lastName;
    private String phone;

    private Role role;

    @Builder.Default
    private boolean isVerified = false; // for recruiter validation by admin

    @Builder.Default
    private boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
