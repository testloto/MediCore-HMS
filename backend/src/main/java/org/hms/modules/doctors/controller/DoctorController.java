package org.hms.modules.doctors.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.doctors.dto.DoctorRequest;
import org.hms.modules.doctors.dto.DoctorResponse;
import org.hms.modules.doctors.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(
            @PathVariable Long userId,
            @Valid @RequestBody DoctorRequest request) {
        DoctorResponse response = doctorService.createDoctor(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Doctor created successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        DoctorResponse response = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorByUserId(@PathVariable Long userId) {
        DoctorResponse response = doctorService.getDoctorByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/doctor-id/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorByDoctorId(@PathVariable String doctorId) {
        DoctorResponse response = doctorService.getDoctorByDoctorId(doctorId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        List<DoctorResponse> responses = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAvailableDoctors() {
        List<DoctorResponse> responses = doctorService.getAvailableDoctors();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/specialization/{specialization}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        List<DoctorResponse> responses = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {
        DoctorResponse response = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Doctor updated successfully", response));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available) {
        DoctorResponse response = doctorService.updateAvailability(id, available);
        return ResponseEntity.ok(ApiResponse.success("Availability updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted successfully", null));
    }
}