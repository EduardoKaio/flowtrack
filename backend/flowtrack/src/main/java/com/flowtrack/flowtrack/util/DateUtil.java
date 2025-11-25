package com.flowtrack.flowtrack.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Utilitário para trabalhar com datas no timezone de Brasília (America/Sao_Paulo)
 */
public class DateUtil {
    
    private static final ZoneId BRASILIA_ZONE = ZoneId.of("America/Sao_Paulo");
    
    /**
     * Retorna a data atual no timezone de Brasília
     */
    public static LocalDate hoje() {
        LocalDate hoje = LocalDate.now(BRASILIA_ZONE);
        return hoje;
    }
    
    /**
     * Retorna a data e hora atual no timezone de Brasília
     */
    public static LocalDateTime agora() {
        return LocalDateTime.now(BRASILIA_ZONE);
    }
    
    /**
     * Retorna o ZoneId de Brasília
     */
    public static ZoneId getBrasiliaZone() {
        return BRASILIA_ZONE;
    }
}

