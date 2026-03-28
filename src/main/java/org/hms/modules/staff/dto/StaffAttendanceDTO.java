package org.hms.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffAttendanceDTO {
    private Long id;
    private Long staffId;
    private String staffName;
    private LocalDate date;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private String status; // PRESENT, ABSENT, LATE, HALF_DAY, HOLIDAY, LEAVE
    private String remarks;
}