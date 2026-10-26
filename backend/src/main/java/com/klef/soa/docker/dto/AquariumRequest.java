package com.klef.soa.docker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AquariumRequest {

    @NotBlank
    private String aquariumName;

    @NotBlank
    private String city;

    @Min(0)
    private int speciesCount;

    @NotNull
    @DecimalMin("0.0")
    private Double entryFee;
}