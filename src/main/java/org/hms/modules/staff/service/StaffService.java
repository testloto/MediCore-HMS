package org.hms.modules.staff.service;

import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.auth.entity.Role;
import org.hms.modules.auth.entity.User;
import org.hms.modules.auth.repository.UserRepository;
import org.hms.modules.staff.dto.StaffRequest;
import org.hms.modules.staff.dto.StaffResponse;
import org.hms.modules.staff.entity.Staff;
import org.hms.modules.staff.entity.StaffDepartment;
import org.hms.modules.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    @Transactional
    public StaffResponse createStaff(Long userId, StaffRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (staffRepository.existsByStaffId(request.getStaffId())) {
            throw new RuntimeException("Staff ID already exists");
        }

        // Update user role if needed
        if (user.getRole() != Role.STAFF && user.getRole() != Role.ADMIN) {
            user.setRole(Role.STAFF);
            userRepository.save(user);
        }

        Staff staff = Staff.builder()
                .user(user)
                .staffId(request.getStaffId())
                .department(request.getDepartment())
                .position(request.getPosition())
                .employmentType(request.getEmploymentType())
                .joiningDate(request.getJoiningDate())
                .contractEndDate(request.getContractEndDate())
                .qualification(request.getQualification())
                .yearsOfExperience(request.getYearsOfExperience())
                .previousEmployer(request.getPreviousEmployer())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .emergencyContactRelation(request.getEmergencyContactRelation())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .workLocation(request.getWorkLocation())
                .shiftTiming(request.getShiftTiming())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .bankAccountNumber(request.getBankAccountNumber())
                .bankName(request.getBankName())
                .ifscCode(request.getIfscCode())
                .panNumber(request.getPanNumber())
                .aadharNumber(request.getAadharNumber())
                .notes(request.getNotes())
                .build();

        Staff savedStaff = staffRepository.save(staff);
        return mapToResponse(savedStaff);
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        return mapToResponse(staff);
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaffByUserId(Long userId) {
        Staff staff = staffRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found for user id: " + userId));
        return mapToResponse(staff);
    }

    @Transactional(readOnly = true)
    public StaffResponse getStaffByStaffId(String staffId) {
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with staff ID: " + staffId));
        return mapToResponse(staff);
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> getActiveStaff() {
        return staffRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> getStaffByDepartment(StaffDepartment department) {
        return staffRepository.findByDepartment(department).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> getActiveStaffByDepartment(StaffDepartment department) {
        return staffRepository.findActiveByDepartment(department).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffResponse updateStaff(Long id, StaffRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));

        staff.setDepartment(request.getDepartment());
        staff.setPosition(request.getPosition());
        staff.setEmploymentType(request.getEmploymentType());
        staff.setJoiningDate(request.getJoiningDate());
        staff.setContractEndDate(request.getContractEndDate());
        staff.setQualification(request.getQualification());
        staff.setYearsOfExperience(request.getYearsOfExperience());
        staff.setPreviousEmployer(request.getPreviousEmployer());
        staff.setEmergencyContactName(request.getEmergencyContactName());
        staff.setEmergencyContactPhone(request.getEmergencyContactPhone());
        staff.setEmergencyContactRelation(request.getEmergencyContactRelation());
        staff.setAddress(request.getAddress());
        staff.setCity(request.getCity());
        staff.setState(request.getState());
        staff.setZipCode(request.getZipCode());
        staff.setWorkLocation(request.getWorkLocation());
        staff.setShiftTiming(request.getShiftTiming());

        if (request.getIsActive() != null) {
            staff.setIsActive(request.getIsActive());
        }

        staff.setBankAccountNumber(request.getBankAccountNumber());
        staff.setBankName(request.getBankName());
        staff.setIfscCode(request.getIfscCode());
        staff.setPanNumber(request.getPanNumber());
        staff.setAadharNumber(request.getAadharNumber());
        staff.setNotes(request.getNotes());

        Staff updatedStaff = staffRepository.save(staff);
        return mapToResponse(updatedStaff);
    }

    @Transactional
    public StaffResponse updateStaffStatus(Long id, Boolean isActive) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));

        staff.setIsActive(isActive);

        // Also update user's enabled status
        User user = staff.getUser();
        user.setEnabled(isActive);
        userRepository.save(user);

        Staff updatedStaff = staffRepository.save(staff);
        return mapToResponse(updatedStaff);
    }

    @Transactional
    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff not found with id: " + id);
        }
        staffRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> searchStaff(String keyword) {
        return staffRepository.searchStaff(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private StaffResponse mapToResponse(Staff staff) {
        User user = staff.getUser();

        String fullName = user.getFullName() != null ? user.getFullName().trim() : "";
        String[] nameParts = fullName.isEmpty() ? new String[0] : fullName.split("\\s+", 2);

        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        return StaffResponse.builder()
                .id(staff.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(user.getPhoneNumber())
                .staffId(staff.getStaffId())
                .department(staff.getDepartment())
                .position(staff.getPosition())
                .employmentType(staff.getEmploymentType())
                .joiningDate(staff.getJoiningDate())
                .contractEndDate(staff.getContractEndDate())
                .qualification(staff.getQualification())
                .yearsOfExperience(staff.getYearsOfExperience())
                .previousEmployer(staff.getPreviousEmployer())
                .emergencyContactName(staff.getEmergencyContactName())
                .emergencyContactPhone(staff.getEmergencyContactPhone())
                .emergencyContactRelation(staff.getEmergencyContactRelation())
                .address(staff.getAddress())
                .city(staff.getCity())
                .state(staff.getState())
                .zipCode(staff.getZipCode())
                .workLocation(staff.getWorkLocation())
                .shiftTiming(staff.getShiftTiming())
                .isActive(staff.getIsActive())
                .bankAccountNumber(staff.getBankAccountNumber())
                .bankName(staff.getBankName())
                .ifscCode(staff.getIfscCode())
                .panNumber(staff.getPanNumber())
                .aadharNumber(staff.getAadharNumber())
                .notes(staff.getNotes())
                .createdAt(staff.getCreatedAt())
                .updatedAt(staff.getUpdatedAt())
                .build();
    }
}