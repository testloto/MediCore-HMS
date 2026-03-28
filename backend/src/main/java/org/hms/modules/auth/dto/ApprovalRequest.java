package org.hms.modules.auth.dto;

import org.hms.modules.auth.entity.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Action is required")
    private AccountStatus action; // APPROVED or REJECTED

    private String rejectionReason; // Required if action is REJECTED
}