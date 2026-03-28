package org.hms.modules.pharmacy.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hms.modules.pharmacy.dto.PrescriptionItemRequest;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    private Long appointmentId;

    @NotNull(message = "Prescription date is required")
    private LocalDate prescriptionDate;

    @Future(message = "Valid until date must be in the future")
    private LocalDate validUntil;

    private String diagnosis;

    private String notes;

    private List<PrescriptionItemRequest> items;
}