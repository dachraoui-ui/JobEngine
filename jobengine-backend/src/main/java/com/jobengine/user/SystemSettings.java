package com.jobengine.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("system_settings")
public class SystemSettings {
    @Id
    private String id; // "GLOBAL"

    @Builder.Default
    private double matchingThreshold = 60.0;

    @Builder.Default
    private double autoRejectScore = 40.0;

    @Builder.Default
    private boolean autoRejectEnabled = false;
}
