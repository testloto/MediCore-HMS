package org.hms.modules.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItemResponse {
    private Long id;
    private Long medicineId;
    private String medicineCode;
    private String medicineName;
    private String dosage;
    private String frequency;
    private Integer duration;
    private String durationUnit;
    private String instructions;
    private Integer quantity;
    private Integer quantityDispensed;
    private Double unitPrice;
    private Double totalPrice;
    private Boolean isDispensed;
    private Integer refillsAuthorized;
    private Integer refillsUsed;
}