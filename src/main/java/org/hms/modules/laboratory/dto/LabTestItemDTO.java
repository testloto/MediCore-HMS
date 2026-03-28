package org.hms.modules.laboratory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTestItemDTO {

    @NotNull(message = "Lab test ID is required")
    private Long labTestId;

    private String remarks;
}