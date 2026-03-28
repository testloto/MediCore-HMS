package org.hms.modules.staff.dto;

import org.hms.modules.staff.entity.StaffDepartment;
import org.hms.modules.staff.entity.StaffPosition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffRequest {

    @NotBlank(message = "Staff ID is required")
    private String staffId;

    @NotNull(message = "Department is required")
    private StaffDepartment department;

    @NotNull(message = "Position is required")
    private StaffPosition position;

    private String employmentType;

    @Past(message = "Joining date must be in the past")
    private LocalDate joiningDate;

    private LocalDate contractEndDate;

    private String qualification;

    @Positive(message = "Years of experience must be positive")
    private Integer yearsOfExperience;

    private String previousEmployer;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String emergencyContactRelation;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String workLocation;

    private String shiftTiming;

    private Boolean isActive;

    private String bankAccountNumber;

    private String bankName;

    private String ifscCode;

    private String panNumber;

    private String aadharNumber;

    private String notes;
}