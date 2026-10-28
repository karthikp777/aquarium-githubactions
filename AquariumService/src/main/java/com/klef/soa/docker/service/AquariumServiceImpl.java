package com.klef.soa.docker.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.entity.Aquarium;
import com.klef.soa.docker.dto.AquariumRequest;
import com.klef.soa.docker.repository.AquariumRepository;
import com.klef.soa.docker.service.AquariumService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AquariumServiceImpl implements AquariumService {

    private final AquariumRepository repo;

    public Aquarium addAquarium(AquariumRequest r) {
        Aquarium a = new Aquarium();
        a.setAquariumName(r.getAquariumName());
        a.setCity(r.getCity());
        a.setSpeciesCount(r.getSpeciesCount());
        a.setEntryFee(r.getEntryFee());
        return repo.save(a);
    }

    public List<Aquarium> displayAll() {
        return repo.findAll();
    }

    public Aquarium displayById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Aquarium not found"));
    }

    public Aquarium updateAquarium(Long id, AquariumRequest r) {
        Aquarium a = displayById(id);
        a.setAquariumName(r.getAquariumName());
        a.setCity(r.getCity());
        a.setSpeciesCount(r.getSpeciesCount());
        a.setEntryFee(r.getEntryFee());
        return repo.save(a);
    }

    public void deleteById(Long id) {
        repo.delete(displayById(id));
    }
}