package org.hms.modules.auth.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.auth.dto.*;
import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.service.AdminAuthService;
import org.hms.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AdminAuthService adminAuthService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration request submitted successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }


    @PostMapping("/demo-login")
    public ResponseEntity<ApiResponse<LoginResponse>> demoLogin(@RequestParam String role) {
        LoginResponse response = authService.demoLogin(role);
        return ResponseEntity.ok(ApiResponse.success("Demo login successful", response));
    }
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<RegistrationResponse>> me() {
        var user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    // Admin endpoints for managing registrations
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getPendingRegistrations() {
        List<RegistrationResponse> responses = adminAuthService.getPendingRegistrations();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getAllRegistrations() {
        List<RegistrationResponse> responses = adminAuthService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/admin/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> approveUser(@Valid @RequestBody ApprovalRequest request) {
        RegistrationResponse response = adminAuthService.approveUser(request);
        String message = request.getAction() == AccountStatus.APPROVED ?
                "User approved successfully" : "User rejected successfully";
        return ResponseEntity.ok(ApiResponse.success(message, response));
    }

    @PostMapping("/admin/notify/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> resendNotification(@PathVariable Long userId) {
        RegistrationResponse response = adminAuthService.resendApprovalNotification(userId);
        return ResponseEntity.ok(ApiResponse.success("Notification resent successfully", response));
    }
}