package org.hms.modules.pharmacy.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.pharmacy.dto.*;
import org.hms.modules.pharmacy.service.PharmacyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    // Medicine Management Endpoints
    @PostMapping("/medicines")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<MedicineResponse>> createMedicine(@Valid @RequestBody MedicineRequest request) {
        MedicineResponse response = pharmacyService.createMedicine(request);
        return ResponseEntity.ok(ApiResponse.success("Medicine created successfully", response));
    }

    @GetMapping("/medicines/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST') or hasRole('NURSE')")
    public ResponseEntity<ApiResponse<MedicineResponse>> getMedicineById(@PathVariable Long id) {
        MedicineResponse response = pharmacyService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/medicines/code/{medicineCode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<MedicineResponse>> getMedicineByCode(@PathVariable String medicineCode) {
        MedicineResponse response = pharmacyService.getMedicineByCode(medicineCode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/medicines")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST') or hasRole('NURSE')")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getAllMedicines() {
        List<MedicineResponse> responses = pharmacyService.getAllMedicines();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/medicines/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getActiveMedicines() {
        List<MedicineResponse> responses = pharmacyService.getActiveMedicines();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/medicines/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getLowStockMedicines() {
        List<MedicineResponse> responses = pharmacyService.getLowStockMedicines();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/medicines/near-expiry")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getNearExpiryMedicines(
            @RequestParam(defaultValue = "30") int days) {
        List<MedicineResponse> responses = pharmacyService.getNearExpiryMedicines(days);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PutMapping("/medicines/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<MedicineResponse>> updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody MedicineRequest request) {
        MedicineResponse response = pharmacyService.updateMedicine(id, request);
        return ResponseEntity.ok(ApiResponse.success("Medicine updated successfully", response));
    }

    @DeleteMapping("/medicines/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(@PathVariable Long id) {
        pharmacyService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted successfully", null));
    }

    // Stock Management Endpoints
    @PostMapping("/stock/adjust")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<StockMovementResponse>> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        StockMovementResponse response = pharmacyService.adjustStock(request);
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted successfully", response));
    }

    @GetMapping("/stock/movements/{medicineId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<List<StockMovementResponse>>> getMedicineStockMovements(@PathVariable Long medicineId) {
        List<StockMovementResponse> responses = pharmacyService.getMedicineStockMovements(medicineId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // Prescription Management Endpoints
    @PostMapping("/prescriptions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        PrescriptionResponse response = pharmacyService.createPrescription(request);
        return ResponseEntity.ok(ApiResponse.success("Prescription created successfully", response));
    }

    @GetMapping("/prescriptions/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST') or hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> getPrescriptionById(@PathVariable Long id) {
        PrescriptionResponse response = pharmacyService.getPrescriptionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/prescriptions/number/{prescriptionNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> getPrescriptionByNumber(@PathVariable String prescriptionNumber) {
        PrescriptionResponse response = pharmacyService.getPrescriptionByNumber(prescriptionNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patients/{patientId}/prescriptions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<List<PrescriptionResponse>>> getPrescriptionsByPatient(@PathVariable Long patientId) {
        List<PrescriptionResponse> responses = pharmacyService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/patients/{patientId}/prescriptions/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<List<PrescriptionResponse>>> getActivePrescriptionsByPatient(@PathVariable Long patientId) {
        List<PrescriptionResponse> responses = pharmacyService.getActivePrescriptionsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/prescriptions/dispense")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> dispensePrescription(@Valid @RequestBody DispenseRequest request) {
        PrescriptionResponse response = pharmacyService.dispensePrescription(request);
        return ResponseEntity.ok(ApiResponse.success("Prescription dispensed successfully", response));
    }

    @PostMapping("/prescriptions/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> cancelPrescription(
            @PathVariable Long id,
            @RequestParam String reason) {
        PrescriptionResponse response = pharmacyService.cancelPrescription(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Prescription cancelled successfully", response));
    }
}