package org.hms.modules.laboratory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTestRequest {

    @NotBlank(message = "Test code is required")
    private String testCode;

    @NotBlank(message = "Test name is required")
    private String testName;

    private String category;

    private String description;

    private String instructions;

    private String preparationInstructions;

    private String normalRange;

    private String unit;

    @NotNull(message = "Cost is required")
    @Positive(message = "Cost must be positive")
    private Double cost;

    @Positive(message = "Turnaround time must be positive")
    private Integer turnaroundTimeHours;

    private Boolean isActive;
}