package org.hms.modules.pharmacy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DispenseRequest {

    @NotNull(message = "Prescription ID is required")
    private Long prescriptionId;

    private List<DispenseItemRequest> items;

    private String notes;
}