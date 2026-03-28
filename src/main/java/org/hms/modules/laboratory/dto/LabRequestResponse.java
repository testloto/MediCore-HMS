package org.hms.modules.laboratory.dto;

import org.hms.modules.laboratory.entity.LabRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hms.modules.laboratory.dto.LabResultResponse;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabRequestResponse {
    private Long id;
    private String requestNumber;

    // Patient info
    private Long patientId;
    private String patientName;
    private String patientIdNumber;

    // Doctor info
    private Long doctorId;
    private String doctorName;

    private Long appointmentId;
    private String appointmentNumber;

    private LocalDateTime requestDate;
    private String requestedBy;
    private LabRequestStatus status;
    private String clinicalNotes;
    private String diagnosis;
    private Boolean isUrgent;

    // Sample collection
    private LocalDateTime sampleCollectedDate;
    private String sampleCollectedBy;
    private String sampleType;
    private String sampleNotes;

    // Results
    private LocalDateTime resultDate;
    private String resultEnteredBy;
    private String resultApprovedBy;
    private LocalDateTime resultApprovedDate;

    private List<LabResultResponse> results;
    private String reportHtml;
    private String reportPdfPath;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}