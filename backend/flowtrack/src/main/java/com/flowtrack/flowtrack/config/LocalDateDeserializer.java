package com.flowtrack.flowtrack.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Deserializador customizado para LocalDate que garante parse correto
 */
public class LocalDateDeserializer extends JsonDeserializer<LocalDate> {
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateString = p.getText();
        if (dateString == null || dateString.isEmpty()) {
            return null;
        }
        // Parse a data diretamente (formato YYYY-MM-DD não tem timezone)
        // LocalDate não tem timezone, então parse direto est? correto
        return LocalDate.parse(dateString, FORMATTER);
    }
}

