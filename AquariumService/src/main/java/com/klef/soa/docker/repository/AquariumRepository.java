package com.klef.soa.docker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.soa.docker.entity.Aquarium;

public interface AquariumRepository
        extends JpaRepository<Aquarium, Long> {
}