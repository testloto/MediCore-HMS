package org.hms.modules.staff.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffLeaveRequestDTO {

    @NotNull(message = "Staff ID is required")
    private Long staffId;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    private String leaveType; // SICK, CASUAL, ANNUAL, MATERNITY, PATERNITY, UNPAID

    private String reason;

    private String contactDuringLeave;
}