package org.hms.modules.staff.dto;

import org.hms.modules.staff.entity.StaffDepartment;
import org.hms.modules.staff.entity.StaffPosition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String staffId;
    private StaffDepartment department;
    private StaffPosition position;
    private String employmentType;
    private LocalDate joiningDate;
    private LocalDate contractEndDate;
    private String qualification;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}