package org.hms.modules.pharmacy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequest {

    @NotBlank(message = "Medicine code is required")
    private String medicineCode;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String genericName;

    private String category;

    private String manufacturer;

    private String dosageForm;

    private String strength;

    private String unit;

    private Integer packSize;

    @NotNull(message = "Unit price is required")
    @Positive(message = "Unit price must be positive")
    private Double unitPrice;

    @NotNull(message = "Selling price is required")
    @Positive(message = "Selling price must be positive")
    private Double sellingPrice;

    private Double taxPercentage;

    @PositiveOrZero(message = "Current stock must be zero or positive")
    private Integer currentStock;

    @PositiveOrZero(message = "Minimum stock level must be zero or positive")
    private Integer minimumStockLevel;

    @PositiveOrZero(message = "Maximum stock level must be zero or positive")
    private Integer maximumStockLevel;

    @PositiveOrZero(message = "Reorder level must be zero or positive")
    private Integer reorderLevel;

    private String locationInPharmacy;

    private Boolean requiresPrescription;

    private Boolean isActive;

    private LocalDate expiryDate;

    private String batchNumber;

    private String description;

    private String sideEffects;

    private String contraindications;
}