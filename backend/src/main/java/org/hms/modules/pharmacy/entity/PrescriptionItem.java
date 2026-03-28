package org.hms.modules.pharmacy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "prescription_items")
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    private String dosage;

    private String frequency;

    private Integer duration;

    @Column(name = "duration_unit")
    private String durationUnit; // days, weeks, months

    private String instructions;

    private Integer quantity;

    @Column(name = "quantity_dispensed")
    private Integer quantityDispensed;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "is_dispensed")
    private Boolean isDispensed = false;

    @Column(name = "refills_authorized")
    private Integer refillsAuthorized;

    @Column(name = "refills_used")
    private Integer refillsUsed = 0;
}