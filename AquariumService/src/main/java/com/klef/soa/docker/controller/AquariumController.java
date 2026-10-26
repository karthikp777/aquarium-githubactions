package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.klef.soa.docker.entity.Aquarium;
import com.klef.soa.docker.dto.AquariumRequest;
import com.klef.soa.docker.service.AquariumService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/aquarium")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AquariumController {

    private final AquariumService service;

    @GetMapping("/")
    public String home() {
        return "Aquarium API is running";
    }

    @PostMapping("/add")
    public ResponseEntity<Aquarium> add(
            @Valid @RequestBody AquariumRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.addAquarium(request));
    }

    @GetMapping("/displayall")
    public List<Aquarium> displayAll() {
        return service.displayAll();
    }

    @GetMapping("/{id}")
    public Aquarium displayById(@PathVariable Long id) {
        return service.displayById(id);
    }

    @PutMapping("/update/{id}")
    public Aquarium update(@PathVariable Long id,
            @Valid @RequestBody AquariumRequest request) {
        return service.updateAquarium(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "Aquarium deleted successfully";
    }
}