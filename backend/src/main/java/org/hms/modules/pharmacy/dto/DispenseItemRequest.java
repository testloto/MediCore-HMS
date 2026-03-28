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
public class DispenseItemRequest {

    @NotNull(message = "Prescription item ID is required")
    private Long prescriptionItemId;

    @NotNull(message = "Quantity to dispense is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
}
