package org.hms.modules.doctors.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String doctorId;
    private String specialization;
    private String qualification;
    private Integer yearsOfExperience;
    private String licenseNumber;
    private String department;
    private Double consultationFee;
    private List<String> availableDays;
    private String availableTimeFrom;
    private String availableTimeTo;
    private String biography;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}