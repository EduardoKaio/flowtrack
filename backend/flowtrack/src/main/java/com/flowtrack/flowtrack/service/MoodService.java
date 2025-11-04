package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.MoodDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.mapper.MoodMapper;
import com.flowtrack.flowtrack.model.Mood;
import com.flowtrack.flowtrack.repository.MoodRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class MoodService {
    private MoodRepository moodRepository;

    private MoodMapper moodMapper;

    MoodService(MoodRepository moodRepository, MoodMapper moodMapper) {
        this.moodRepository = moodRepository;
        this.moodMapper = moodMapper;
    }

    public Page<MoodDTO> findAllMoods(Pageable pageable) {
        return moodRepository.findAll(pageable)
                .map(moodMapper::moodToMoodDTO);
    }

    public Page<MoodDTO> filterMoodsByDate(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(java.time.LocalTime.MAX);
        return moodRepository.findByDateRange(startDateTime, endDateTime, pageable)
                .map(moodMapper::moodToMoodDTO);
    }

    public MoodDTO findMoodById(Long id) {
        Mood mood = moodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mood not found with id: " + id));
        return moodMapper.moodToMoodDTO(mood);
    }

    public MoodDTO createMood(MoodDTO moodDTO) {
        Mood mood = moodMapper.moodDTOToMood(moodDTO);
        mood.setDataCriacao(LocalDateTime.now());
        Mood savedMood = moodRepository.save(mood);
        return moodMapper.moodToMoodDTO(savedMood);
    }

    public MoodDTO updateMood(Long id, MoodDTO moodDTO) {
        Mood existingMood = moodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mood not found with id: " + id));

        existingMood.setHumor(moodDTO.getHumor());
        existingMood.setEmoji(moodDTO.getEmoji());
        existingMood.setEnergia(moodDTO.getEnergia());
        existingMood.setEstresse(moodDTO.getEstresse());
        existingMood.setNotas(moodDTO.getNotas());

        Mood updatedMood = moodRepository.save(existingMood);
        return moodMapper.moodToMoodDTO(updatedMood);
    }

    public void deleteMood(Long id) {
        if (!moodRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mood not found with id: " + id);
        }
        moodRepository.deleteById(id);
    }
}
