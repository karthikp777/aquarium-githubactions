package com.klef.soa.docker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aquarium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String aquariumName;

    @NotBlank(message = "City is required")
    private String city;

    @Min(value = 0, message = "Species count cannot be negative")
    private int speciesCount;

    @NotNull
    @DecimalMin(value = "0.0", message = "Entry fee cannot be negative")
    private Double entryFee;
}