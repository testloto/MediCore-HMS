package org.hms.modules.pharmacy.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItemRequest {

    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    private String dosage;

    private String frequency;

    @Positive(message = "Duration must be positive")
    private Integer duration;

    private String durationUnit;

    private String instructions;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @Positive(message = "Refills authorized must be positive")
    private Integer refillsAuthorized;
}