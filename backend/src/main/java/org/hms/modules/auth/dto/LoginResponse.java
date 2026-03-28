package org.hms.modules.auth.dto;

import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String fullName;
    private Role role;
    private String department;
    private String phoneNumber;
    private AccountStatus accountStatus;
    private boolean isApproved;
    private String message;
}