package org.hms.modules.doctors.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRequest {

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    private String specialization;

    private String qualification;

    @Positive(message = "Years of experience must be positive")
    private Integer yearsOfExperience;

    private String licenseNumber;

    private String department;

    @Positive(message = "Consultation fee must be positive")
    private Double consultationFee;

    private List<String> availableDays;

    private String availableTimeFrom;

    private String availableTimeTo;

    private String biography;

    private Boolean isAvailable;
}