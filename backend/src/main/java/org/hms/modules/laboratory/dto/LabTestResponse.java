package org.hms.modules.laboratory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTestResponse {
    private Long id;
    private String testCode;
    private String testName;
    private String category;
    private String description;
    private String instructions;
    private String preparationInstructions;
    private String normalRange;
    private String unit;
    private Double cost;
    private Integer turnaroundTimeHours;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}