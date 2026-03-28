package org.hms.modules.pharmacy.dto;

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
public class MedicineResponse {
    private Long id;
    private String medicineCode;
    private String medicineName;
    private String genericName;
    private String category;
    private String manufacturer;
    private String dosageForm;
    private String strength;
    private String unit;
    private Integer packSize;
    private Double unitPrice;
    private Double sellingPrice;
    private Double taxPercentage;
    private Integer currentStock;
    private Integer minimumStockLevel;
    private Integer maximumStockLevel;
    private Integer reorderLevel;
    private String locationInPharmacy;
    private Boolean requiresPrescription;
    private Boolean isActive;
    private LocalDate expiryDate;
    private String batchNumber;
    private String description;
    private String sideEffects;
    private String contraindications;
    private Boolean isLowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}