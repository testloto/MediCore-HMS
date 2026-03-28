package org.hms.modules.pharmacy.dto;

import org.hms.modules.pharmacy.entity.MovementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementResponse {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String medicineCode;
    private MovementType movementType;
    private Integer quantity;
    private Integer previousStock;
    private Integer newStock;
    private String referenceNumber;
    private String reason;
    private String performedBy;
    private String notes;
    private LocalDateTime createdAt;
}
