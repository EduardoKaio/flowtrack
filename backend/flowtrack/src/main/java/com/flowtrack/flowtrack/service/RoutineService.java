package com.flowtrack.flowtrack.service;  // Ajuste o pacote conforme seu projeto

import com.flowtrack.flowtrack.dto.RoutineCreateDTO;
import com.flowtrack.flowtrack.dto.RoutineDTO;
import com.flowtrack.flowtrack.dto.RoutineUpdateDTO;
import com.flowtrack.flowtrack.mapper.RoutineMapper;
import com.flowtrack.flowtrack.model.Routine;
import com.flowtrack.flowtrack.model.User;
import com.flowtrack.flowtrack.repository.RoutineRepository;
import com.flowtrack.flowtrack.util.SecurityUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;

    private User getCurrentUserEntity() {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new EntityNotFoundException("Usuário não autenticado");
        }
        return currentUser;
    }

    public RoutineDTO create(RoutineCreateDTO dto) {
        User user = getCurrentUserEntity();
        Routine r = RoutineMapper.toEntity(dto);
        r.setUser(user);
        Routine saved = routineRepository.save(r);
        return RoutineMapper.toDto(saved);
    }

    public RoutineDTO update(Long id, RoutineUpdateDTO dto) {
        User user = getCurrentUserEntity();
        Routine r = routineRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new EntityNotFoundException("Rotina não encontrada ou sem permissão"));
        RoutineMapper.updateEntity(dto, r);
        Routine saved = routineRepository.save(r);
        return RoutineMapper.toDto(saved);
    }

    public void delete(Long id) {
        User user = getCurrentUserEntity();
        Routine r = routineRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new EntityNotFoundException("Rotina não encontrada ou sem permissão"));
        routineRepository.delete(r);
    }

    @Transactional(readOnly = true)
    public RoutineDTO findById(Long id) {
        User user = getCurrentUserEntity();
        Routine r = routineRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new EntityNotFoundException("Rotina não encontrada ou sem permissão"));
        return RoutineMapper.toDto(r);
    }

    @Transactional(readOnly = true)
    public Page<RoutineDTO> findAll(Pageable pageable) {
        User user = getCurrentUserEntity();
        Page<Routine> page = routineRepository.findByUser(user, pageable);
        return page.map(RoutineMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<RoutineDTO> findAllNoPage() {
        User user = getCurrentUserEntity();
        return routineRepository.findByUser(user).stream().map(RoutineMapper::toDto).collect(Collectors.toList());
    }

    @Transactional
    public RoutineDTO toggleCompleted(Long id) {
        User user = getCurrentUserEntity();
        Routine r = routineRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new EntityNotFoundException("Rotina não encontrada"));
        r.setCompleted(!r.getCompleted());
        Routine saved = routineRepository.save(r);
        return RoutineMapper.toDto(saved);
    }
}


