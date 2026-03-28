package org.hms.modules.billing.dto;

import org.hms.modules.billing.entity.PaymentMethod;
import org.hms.modules.billing.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;

    // Patient info
    private Long patientId;
    private String patientName;
    private String patientPhone;

    // Appointment info
    private Long appointmentId;
    private String appointmentNumber;

    private LocalDateTime invoiceDate;
    private LocalDateTime dueDate;

    private List<InvoiceItemResponse> items;
    private Double subtotal;
    private Double tax;
    private Double taxRate;
    private Double discount;
    private String discountType;
    private Double total;
    private Double amountPaid;
    private Double balanceDue;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}