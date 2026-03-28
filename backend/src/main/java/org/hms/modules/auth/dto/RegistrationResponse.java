package org.hms.modules.auth.dto;

import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String department;
    private String employeeId;
    private String licenseId;
    private AccountStatus accountStatus;
    private String message;
    private LocalDateTime registeredAt;
}