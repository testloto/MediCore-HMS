package org.hms.modules.auth.controller;

import org.hms.common.dto.ApiResponse;
import org.hms.modules.auth.dto.ApprovalRequest;
import org.hms.modules.auth.entity.User;
import org.hms.modules.auth.service.AdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminAuthService adminAuthService;

    @GetMapping("/pending-users")
    public ResponseEntity<ApiResponse<?>> getPendingUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminAuthService.getPendingRegistrations()));
    }

    @PostMapping("/approve-user")
    public ResponseEntity<ApiResponse<?>> approveUser(@RequestBody ApprovalRequest request) {
        return ResponseEntity.ok(ApiResponse.success(adminAuthService.approveUser(request)));
    }
    @GetMapping("/all-users")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success(adminAuthService.getAllRegistrations())
        );
    }
}