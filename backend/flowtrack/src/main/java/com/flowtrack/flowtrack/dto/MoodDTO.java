package com.flowtrack.flowtrack.dto;

import com.flowtrack.flowtrack.enums.Moods;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private Moods humor;
    private String emoji;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer energia;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer estresse;

    private String notas;
    private LocalDateTime dataCriacao = LocalDateTime.now();
    private Long userId;
}
