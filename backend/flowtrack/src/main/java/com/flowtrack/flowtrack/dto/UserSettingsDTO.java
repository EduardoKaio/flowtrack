package com.flowtrack.flowtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDTO {
    private String theme;
    private Boolean notifications;
    private Boolean soundEnabled;
    private String language;
    private Map<String, Boolean> enabledModules;
}
