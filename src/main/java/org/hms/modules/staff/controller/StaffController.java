package org.hms.modules.staff.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.staff.dto.StaffRequest;
import org.hms.modules.staff.dto.StaffResponse;
import org.hms.modules.staff.entity.StaffDepartment;
import org.hms.modules.staff.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StaffResponse>> createStaff(
            @PathVariable Long userId,
            @Valid @RequestBody StaffRequest request) {
        StaffResponse response = staffService.createStaff(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Staff created successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<StaffResponse>> getStaffById(@PathVariable Long id) {
        StaffResponse response = staffService.getStaffById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<StaffResponse>> getStaffByUserId(@PathVariable Long userId) {
        StaffResponse response = staffService.getStaffByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/staff-id/{staffId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<StaffResponse>> getStaffByStaffId(@PathVariable String staffId) {
        StaffResponse response = staffService.getStaffByStaffId(staffId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> getAllStaff() {
        List<StaffResponse> responses = staffService.getAllStaff();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> getActiveStaff() {
        List<StaffResponse> responses = staffService.getActiveStaff();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> getStaffByDepartment(@PathVariable StaffDepartment department) {
        List<StaffResponse> responses = staffService.getStaffByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/department/{department}/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> getActiveStaffByDepartment(@PathVariable StaffDepartment department) {
        List<StaffResponse> responses = staffService.getActiveStaffByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<List<StaffResponse>>> searchStaff(@RequestParam String keyword) {
        List<StaffResponse> responses = staffService.searchStaff(keyword);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StaffResponse>> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody StaffRequest request) {
        StaffResponse response = staffService.updateStaff(id, request);
        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StaffResponse>> updateStaffStatus(
            @PathVariable Long id,
            @RequestParam Boolean active) {
        StaffResponse response = staffService.updateStaffStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Staff status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff deleted successfully", null));
    }
}