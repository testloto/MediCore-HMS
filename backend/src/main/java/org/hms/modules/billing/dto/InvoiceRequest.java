package org.hms.modules.billing.dto;

import org.hms.modules.billing.entity.PaymentMethod;
import org.hms.modules.billing.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
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
public class InvoiceRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private Long appointmentId;

    private LocalDateTime dueDate;

    private Double taxRate;

    private Double discount;

    private String discountType;

    private PaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;

    private String notes;

    private List<InvoiceItemRequest> items;
}