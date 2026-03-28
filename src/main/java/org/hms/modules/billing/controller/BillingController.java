package org.hms.modules.billing.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.billing.dto.InvoiceRequest;
import org.hms.modules.billing.dto.InvoiceResponse;
import org.hms.modules.billing.dto.PaymentRequest;
import org.hms.modules.billing.entity.PaymentStatus;
import org.hms.modules.billing.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/invoices")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(
            @Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse response = billingService.createInvoice(request);
        return ResponseEntity.ok(ApiResponse.success("Invoice created successfully", response));
    }

    @PostMapping("/payments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> processPayment(
            @Valid @RequestBody PaymentRequest request) {
        InvoiceResponse response = billingService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", response));
    }

    @GetMapping("/invoices/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id) {
        InvoiceResponse response = billingService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/invoices/number/{invoiceNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceByNumber(
            @PathVariable String invoiceNumber) {
        InvoiceResponse response = billingService.getInvoiceByNumber(invoiceNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patients/{patientId}/invoices")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByPatient(
            @PathVariable Long patientId) {
        List<InvoiceResponse> responses = billingService.getInvoicesByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/patients/{patientId}/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getPendingInvoicesByPatient(
            @PathVariable Long patientId) {
        List<InvoiceResponse> responses = billingService.getPendingInvoicesByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/invoices/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByStatus(
            @PathVariable PaymentStatus status) {
        List<InvoiceResponse> responses = billingService.getInvoicesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Double>> getRevenueBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Double revenue = billingService.getRevenueBetweenDates(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Revenue calculated successfully", revenue));
    }
}