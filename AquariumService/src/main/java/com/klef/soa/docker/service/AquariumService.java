package com.klef.soa.docker.service;

import java.util.List;
import com.klef.soa.docker.entity.Aquarium;
import com.klef.soa.docker.dto.AquariumRequest;

public interface AquariumService {

    Aquarium addAquarium(AquariumRequest request);

    List<Aquarium> displayAll();

    Aquarium displayById(Long id);

    Aquarium updateAquarium(Long id, AquariumRequest request);

    void deleteById(Long id);
}