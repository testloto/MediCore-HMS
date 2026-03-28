package org.hms.modules.laboratory.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.laboratory.dto.*;
import org.hms.modules.laboratory.entity.LabRequestStatus;
import org.hms.modules.laboratory.service.LaboratoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laboratory")
@RequiredArgsConstructor
public class LaboratoryController {

    private final LaboratoryService laboratoryService;

    // Lab Test Management Endpoints
    @PostMapping("/tests")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabTestResponse>> createLabTest(@Valid @RequestBody LabTestRequest request) {
        LabTestResponse response = laboratoryService.createLabTest(request);
        return ResponseEntity.ok(ApiResponse.success("Lab test created successfully", response));
    }

    @GetMapping("/tests/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabTestResponse>> getLabTestById(@PathVariable Long id) {
        LabTestResponse response = laboratoryService.getLabTestById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/tests/code/{testCode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabTestResponse>> getLabTestByCode(@PathVariable String testCode) {
        LabTestResponse response = laboratoryService.getLabTestByCode(testCode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/tests")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getAllLabTests() {
        List<LabTestResponse> responses = laboratoryService.getAllLabTests();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/tests/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getActiveLabTests() {
        List<LabTestResponse> responses = laboratoryService.getActiveLabTests();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PutMapping("/tests/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabTestResponse>> updateLabTest(
            @PathVariable Long id,
            @Valid @RequestBody LabTestRequest request) {
        LabTestResponse response = laboratoryService.updateLabTest(id, request);
        return ResponseEntity.ok(ApiResponse.success("Lab test updated successfully", response));
    }

    @DeleteMapping("/tests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLabTest(@PathVariable Long id) {
        laboratoryService.deleteLabTest(id);
        return ResponseEntity.ok(ApiResponse.success("Lab test deleted successfully", null));
    }

    // Lab Request Endpoints
    @PostMapping("/requests")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<LabRequestResponse>> createLabRequest(@Valid @RequestBody LabRequestDTO request) {
        LabRequestResponse response = laboratoryService.createLabRequest(request);
        return ResponseEntity.ok(ApiResponse.success("Lab request created successfully", response));
    }

    @GetMapping("/requests/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabRequestResponse>> getLabRequestById(@PathVariable Long id) {
        LabRequestResponse response = laboratoryService.getLabRequestById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/requests/number/{requestNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabRequestResponse>> getLabRequestByNumber(@PathVariable String requestNumber) {
        LabRequestResponse response = laboratoryService.getLabRequestByNumber(requestNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patients/{patientId}/requests")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<LabRequestResponse>>> getLabRequestsByPatient(@PathVariable Long patientId) {
        List<LabRequestResponse> responses = laboratoryService.getLabRequestsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/requests/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<LabRequestResponse>>> getLabRequestsByStatus(@PathVariable LabRequestStatus status) {
        List<LabRequestResponse> responses = laboratoryService.getLabRequestsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/requests/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<LabRequestResponse>>> getPendingRequests() {
        List<LabRequestResponse> responses = laboratoryService.getPendingRequests();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/requests/urgent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<LabRequestResponse>>> getUrgentRequests() {
        List<LabRequestResponse> responses = laboratoryService.getUrgentRequests();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PatchMapping("/requests/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabRequestResponse>> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam LabRequestStatus status) {
        LabRequestResponse response = laboratoryService.updateRequestStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Request status updated successfully", response));
    }

    @PatchMapping("/requests/{id}/sample")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabRequestResponse>> updateSampleInfo(
            @PathVariable Long id,
            @RequestParam String sampleType,
            @RequestParam(required = false) String sampleNotes) {
        LabRequestResponse response = laboratoryService.updateSampleInfo(id, sampleType, sampleNotes);
        return ResponseEntity.ok(ApiResponse.success("Sample info updated successfully", response));
    }

    @PostMapping("/requests/{requestId}/results")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabResultResponse>> enterResult(
            @PathVariable Long requestId,
            @Valid @RequestBody LabResultEntryDTO resultEntry) {
        LabResultResponse response = laboratoryService.enterResult(requestId, resultEntry);
        return ResponseEntity.ok(ApiResponse.success("Result entered successfully", response));
    }

    @PostMapping("/requests/{id}/generate-report")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ApiResponse<LabRequestResponse>> generateReport(@PathVariable Long id) {
        LabRequestResponse response = laboratoryService.generateReport(id);
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", response));
    }
}