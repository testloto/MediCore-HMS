package org.hms.modules.pharmacy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medicines")
@EntityListeners(AuditingEntityListener.class)
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medicine_code", unique = true, nullable = false)
    private String medicineCode;

    @Column(name = "medicine_name", nullable = false)
    private String medicineName;

    private String genericName;

    private String category;

    private String manufacturer;

    @Column(name = "dosage_form")
    private String dosageForm; // Tablet, Capsule, Syrup, Injection, etc.

    private String strength;

    private String unit;

    @Column(name = "pack_size")
    private Integer packSize;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "selling_price")
    private Double sellingPrice;

    @Column(name = "tax_percentage")
    private Double taxPercentage;

    @Column(name = "current_stock")
    private Integer currentStock;

    @Column(name = "minimum_stock_level")
    private Integer minimumStockLevel;

    @Column(name = "maximum_stock_level")
    private Integer maximumStockLevel;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "location_in_pharmacy")
    private String locationInPharmacy;

    @Column(name = "requires_prescription")
    private Boolean requiresPrescription = true;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "batch_number")
    private String batchNumber;

    private String description;

    private String sideEffects;

    private String contraindications;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}