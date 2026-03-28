package org.hms.modules.pharmacy.dto;

import org.hms.modules.pharmacy.entity.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    private Long id;
    private String prescriptionNumber;

    // Patient info
    private Long patientId;
    private String patientName;
    private String patientIdNumber;

    // Doctor info
    private Long doctorId;
    private String doctorName;

    private Long appointmentId;
    private String appointmentNumber;

    private LocalDate prescriptionDate;
    private LocalDate validUntil;
    private String diagnosis;
    private String notes;
    private PrescriptionStatus status;
    private Boolean isDispensed;
    private LocalDateTime dispensedDate;
    private String dispensedBy;

    private List<PrescriptionItemResponse> items;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}