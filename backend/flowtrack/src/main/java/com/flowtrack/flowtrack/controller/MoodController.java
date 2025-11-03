package com.flowtrack.flowtrack.controller;

import com.flowtrack.flowtrack.dto.MoodDTO;
import com.flowtrack.flowtrack.service.MoodService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/mood")
public class MoodController {
    private MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    @GetMapping
    public ResponseEntity<Page<MoodDTO>> findAllMoods(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        return ResponseEntity.ok(moodService.findAllMoods(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MoodDTO>> filterMoodsByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(moodService.filterMoodsByDate(startDate, endDate, pageable));
        }
        return findAllMoods(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MoodDTO> findMoodById(@PathVariable Long id) {
        return ResponseEntity.ok(moodService.findMoodById(id));
    }

    @PostMapping
    public ResponseEntity<MoodDTO> createMood(@RequestBody MoodDTO moodDTO) {
        return new ResponseEntity<>(moodService.createMood(moodDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MoodDTO> updateMood(@PathVariable Long id, @RequestBody MoodDTO moodDTO) {
        return ResponseEntity.ok(moodService.updateMood(id, moodDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMood(@PathVariable Long id) {
        moodService.deleteMood(id);
        return ResponseEntity.noContent().build();
    }
}
