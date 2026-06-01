package com.jobengine.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import org.springframework.data.annotation.PersistenceCreator;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@Document(collection = "refresh_tokens")
public class RefreshToken {
    @PersistenceCreator
    public RefreshToken() {
    }
    
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String token;

    private Instant expiryDate;
}
