package com.jobengine.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@Document("system_settings")
public class SystemSettings {
    @PersistenceCreator
    public SystemSettings() {
    }
    @Id
    private String id; // "GLOBAL"

    @Builder.Default
    private double matchingThreshold = 60.0;

    @Builder.Default
    private double autoRejectScore = 40.0;

    @Builder.Default
    private boolean autoRejectEnabled = false;
}
