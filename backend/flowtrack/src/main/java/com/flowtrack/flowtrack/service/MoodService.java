package com.flowtrack.flowtrack.service;

import com.flowtrack.flowtrack.dto.MoodDTO;
import com.flowtrack.flowtrack.exception.ResourceNotFoundException;
import com.flowtrack.flowtrack.mapper.MoodMapper;
import com.flowtrack.flowtrack.model.Mood;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.MoodRepository;
import com.flowtrack.flowtrack.util.DateUtil;
import com.flowtrack.flowtrack.util.SecurityUtil;
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
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        return moodRepository.findByUsuario(currentUser, pageable)
                .map(moodMapper::moodToMoodDTO);
    }

    public Page<MoodDTO> filterMoodsByDate(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(java.time.LocalTime.MAX);
        return moodRepository.findByUsuarioAndDateRange(currentUser, startDateTime, endDateTime, pageable)
                .map(moodMapper::moodToMoodDTO);
    }

    public MoodDTO findMoodById(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        Mood mood = moodRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Mood not found with id: " + id));
        return moodMapper.moodToMoodDTO(mood);
    }

    public MoodDTO createMood(MoodDTO moodDTO) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        Mood mood = moodMapper.moodDTOToMood(moodDTO);
        mood.setDataCriacao(DateUtil.agora());
        mood.setUsuario(currentUser);
        Mood savedMood = moodRepository.save(mood);
        return moodMapper.moodToMoodDTO(savedMood);
    }

    public MoodDTO updateMood(Long id, MoodDTO moodDTO) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        Mood existingMood = moodRepository.findByIdAndUsuario(id, currentUser)
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
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new ResourceNotFoundException("Usuario nao autenticado");
        }
        Mood mood = moodRepository.findByIdAndUsuario(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Mood not found with id: " + id));
        moodRepository.delete(mood);
    }
}
