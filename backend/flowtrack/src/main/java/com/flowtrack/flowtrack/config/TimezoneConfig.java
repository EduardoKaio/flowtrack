package com.flowtrack.flowtrack.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

@Configuration
public class TimezoneConfig {

    @PostConstruct
    public void init() {
        // Configurar timezone padrão para America/Sao_Paulo (horário de Brasília)
        TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
        System.setProperty("user.timezone", "America/Sao_Paulo");
    }
}

