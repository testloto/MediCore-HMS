package org.hms.modules.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItemResponse {
    private Long id;
    private String description;
    private Integer quantity;
    private Double unitPrice;
    private Double amount;
    private String itemType;
    private Long referenceId;
}