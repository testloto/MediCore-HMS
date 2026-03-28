package org.hms.modules.billing.entity;

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
@Table(name = "invoice_items")
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    private String description;

    private Integer quantity;

    @Column(name = "unit_price")
    private Double unitPrice;

    private Double amount;

    @Column(name = "item_type")
    private String itemType; // CONSULTATION, MEDICINE, LAB_TEST, PROCEDURE, etc.

    @Column(name = "reference_id")
    private Long referenceId; // ID of related entity (appointment, prescription, etc.)
}