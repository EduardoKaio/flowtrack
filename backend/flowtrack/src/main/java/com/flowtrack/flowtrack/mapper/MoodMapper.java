package com.flowtrack.flowtrack.mapper;

import com.flowtrack.flowtrack.dto.MoodDTO;
import com.flowtrack.flowtrack.model.Mood;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MoodMapper {
    MoodDTO moodToMoodDTO(Mood mood);

    Mood moodDTOToMood(MoodDTO moodDTO);
}
