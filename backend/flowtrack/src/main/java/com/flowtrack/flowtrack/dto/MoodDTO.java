package com.flowtrack.flowtrack.dto;

import com.flowtrack.flowtrack.enums.Moods;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MoodDTO {
    private Long id;
    private Moods humor;
    private String emoji;
    private Integer energia;
    private Integer estresse;
    private String notas;
    private LocalDateTime dataCriacao = LocalDateTime.now();
    private Long userId;
}
